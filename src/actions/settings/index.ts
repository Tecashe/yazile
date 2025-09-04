'use server'

import { auth } from '@clerk/nextjs/server'
import { client } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Get user settings - comprehensive data fetch
export async function getUserSettings() {
  const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    redirect('/sign-in')
  }

  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      include: {
        preferences: true,
        businessHours: true,
        handoffSettings: true,
        crmSyncSettings: true,
        subscription: true,
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      profile: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
      },
      preferences: user.preferences,
      businessHours: user.businessHours,
      handoffSettings: user.handoffSettings,
      crmSyncSettings: user.crmSyncSettings,
      subscription: user.subscription ? {
        plan: user.subscription.plan,
        status: user.subscription.status,
      } : null,
    }
  } catch (error) {
    console.error('Error fetching user settings:', error)
    throw new Error('Failed to fetch user settings')
  }
}

// Update user profile information
export async function updateUserProfile(formData: FormData) {
  const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    redirect('/sign-in')
  }

  const firstname = formData.get('firstname') as string || null
  const lastname = formData.get('lastname') as string || null
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string || null

  // Basic validation
  if (!email || email.trim() === '') {
    throw new Error('Email is required')
  }

  try {
    await client.user.update({
      where: { clerkId },
      data: {
        firstname: firstname?.trim() || null,
        lastname: lastname?.trim() || null,
        email: email.trim(),
        phone: phone?.trim() || null,
      }
    })

    revalidatePath('/settings')
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error('Failed to update profile')
  }
}

// Update user preferences
export async function updateUserPreferences(formData: FormData) {
const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    redirect('/sign-in')
  }

  const soundEnabled = formData.get('soundEnabled') === 'on'
  const desktopNotifications = formData.get('desktopNotifications') === 'on'
  const emailNotifications = formData.get('emailNotifications') === 'on'
  const autoMarkAsRead = formData.get('autoMarkAsRead') === 'on'
  const theme = formData.get('theme') as string || 'system'
  const language = formData.get('language') as string || 'en'

  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      select: { id: true }
    })

    if (!user) {
      throw new Error('User not found')
    }

    await client.userPreferences.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        soundEnabled,
        desktopNotifications,
        emailNotifications,
        autoMarkAsRead,
        theme,
        language,
      },
      update: {
        soundEnabled,
        desktopNotifications,
        emailNotifications,
        autoMarkAsRead,
        theme,
        language,
      }
    })

    revalidatePath('/settings')
  } catch (error) {
    console.error('Error updating user preferences:', error)
    throw new Error('Failed to update preferences')
  }
}

// Update business hours
export async function updateBusinessHours(formData: FormData) {
 const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    redirect('/sign-in')
  }

  const timezone = formData.get('timezone') as string || 'UTC'
  const isActive = formData.get('isActive') === 'on'
  
  // Get all day schedule data
  const scheduleData = {
    timezone,
    mondayStart: formData.get('mondayStart') as string || null,
    mondayEnd: formData.get('mondayEnd') as string || null,
    tuesdayStart: formData.get('tuesdayStart') as string || null,
    tuesdayEnd: formData.get('tuesdayEnd') as string || null,
    wednesdayStart: formData.get('wednesdayStart') as string || null,
    wednesdayEnd: formData.get('wednesdayEnd') as string || null,
    thursdayStart: formData.get('thursdayStart') as string || null,
    thursdayEnd: formData.get('thursdayEnd') as string || null,
    fridayStart: formData.get('fridayStart') as string || null,
    fridayEnd: formData.get('fridayEnd') as string || null,
    saturdayStart: formData.get('saturdayStart') as string || null,
    saturdayEnd: formData.get('saturdayEnd') as string || null,
    sundayStart: formData.get('sundayStart') as string || null,
    sundayEnd: formData.get('sundayEnd') as string || null,
    isActive,
  }

  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      select: { id: true }
    })

    if (!user) {
      throw new Error('User not found')
    }

    await client.businessHours.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...scheduleData,
      },
      update: scheduleData
    })

    revalidatePath('/settings')
  } catch (error) {
    console.error('Error updating business hours:', error)
    throw new Error('Failed to update business hours')
  }
}

// Update handoff settings
export async function updateHandoffSettings(formData: FormData) {
  const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    redirect('/sign-in')
  }

  const isEnabled = formData.get('isEnabled') === 'on'
  const notificationEmail = formData.get('notificationEmail') as string || null
  const slackChannel = formData.get('slackChannel') as string || null
  const defaultPriority = formData.get('defaultPriority') as string || 'MEDIUM'
  const businessHoursOnly = formData.get('businessHoursOnly') === 'on'
  const autoAssign = formData.get('autoAssign') === 'on'
  const maxWaitTime = parseInt(formData.get('maxWaitTime') as string) || 300

  // Validate priority value
  const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
  if (!validPriorities.includes(defaultPriority)) {
    throw new Error('Invalid priority value')
  }

  // Validate maxWaitTime
  if (maxWaitTime < 30 || maxWaitTime > 3600) {
    throw new Error('Max wait time must be between 30 and 3600 seconds')
  }

  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      select: { id: true, businesses: { select: { id: true }, take: 1 } }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // For this example, we'll use the first business or create a default one
    let businessId = user.businesses[0]?.id
    if (!businessId) {
      // Create a default business if none exists
      const business = await client.business.create({
        data: {
          businessName: 'Default Business',
          businessType: 'Default',
          businessDescription: 'Default business for settings',
          website: '',
          responseLanguage: 'en',
          userId: user.id,
        }
      })
      businessId = business.id
    }

    await client.handoffSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        businessId,
        isEnabled,
        notificationEmail,
        slackChannel,
        defaultPriority: defaultPriority as any,
        businessHoursOnly,
        autoAssign,
        maxWaitTime,
      },
      update: {
        isEnabled,
        notificationEmail,
        slackChannel,
        defaultPriority: defaultPriority as any,
        businessHoursOnly,
        autoAssign,
        maxWaitTime,
      }
    })

    revalidatePath('/settings')
  } catch (error) {
    console.error('Error updating handoff settings:', error)
    throw new Error('Failed to update handoff settings')
  }
}

// Update CRM sync settings
export async function updateCrmSyncSettings(formData: FormData) {
  const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    redirect('/sign-in')
  }

  const autoSyncQualified = formData.get('autoSyncQualified') === 'on'
  const createDealsHighValue = formData.get('createDealsHighValue') === 'on'
  const syncLeadScores = formData.get('syncLeadScores') === 'on'
  const realTimeSync = formData.get('realTimeSync') === 'on'

  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      select: { id: true }
    })

    if (!user) {
      throw new Error('User not found')
    }

    await client.crmSyncSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        autoSyncQualified,
        createDealsHighValue,
        syncLeadScores,
        realTimeSync,
      },
      update: {
        autoSyncQualified,
        createDealsHighValue,
        syncLeadScores,
        realTimeSync,
      }
    })

    revalidatePath('/settings')
  } catch (error) {
    console.error('Error updating CRM sync settings:', error)
    throw new Error('Failed to update CRM sync settings')
  }
}

// Additional utility functions

// Get user subscription info
export async function getSubscriptionInfo() {
  const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    redirect('/sign-in')
  }

  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      include: { subscription: true }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user.subscription
  } catch (error) {
    console.error('Error fetching subscription info:', error)
    throw new Error('Failed to fetch subscription information')
  }
}

// Update notification preferences specifically
export async function updateNotificationPreferences(preferences: {
  soundEnabled: boolean
  desktopNotifications: boolean
  emailNotifications: boolean
  autoMarkAsRead: boolean
}) {
  const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    redirect('/sign-in')
  }

  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      select: { id: true }
    })

    if (!user) {
      throw new Error('User not found')
    }

    await client.userPreferences.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        soundEnabled: preferences.soundEnabled,
        desktopNotifications: preferences.desktopNotifications,
        emailNotifications: preferences.emailNotifications,
        autoMarkAsRead: preferences.autoMarkAsRead,
        theme: 'system', // default values
        language: 'en',
      },
      update: {
        soundEnabled: preferences.soundEnabled,
        desktopNotifications: preferences.desktopNotifications,
        emailNotifications: preferences.emailNotifications,
        autoMarkAsRead: preferences.autoMarkAsRead,
      }
    })

    revalidatePath('/settings')
  } catch (error) {
    console.error('Error updating notification preferences:', error)
    throw new Error('Failed to update notification preferences')
  }
}

// Verify phone number
export async function verifyPhoneNumber(phoneNumber: string, verificationCode: string) {
  const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    redirect('/sign-in')
  }

  // This is a placeholder - you would implement actual phone verification logic
  // using services like Twilio, AWS SNS, or similar
  
  try {
    // Simulate verification logic
    const isValid = verificationCode === '123456' // Mock verification
    
    if (!isValid) {
      throw new Error('Invalid verification code')
    }

    await client.user.update({
      where: { clerkId },
      data: {
        phone: phoneNumber,
        phoneVerified: true,
      }
    })

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Error verifying phone number:', error)
    throw new Error('Failed to verify phone number')
  }
}

// Delete user account (with proper cleanup)
export async function deleteUserAccount() {
  const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    redirect('/sign-in')
  }

  try {
    // This would be a complex operation requiring cleanup of all related data
    // For now, just mark as inactive or implement soft delete
    await client.user.update({
      where: { clerkId },
      data: {
        // Implement soft delete or deactivation logic
        // You might want to anonymize data instead of hard delete
      }
    })

    // In a real implementation, you would also:
    // 1. Cancel subscriptions
    // 2. Clean up integrations
    // 3. Remove from external services
    // 4. Handle data export requests
    
    redirect('/account-deleted')
  } catch (error) {
    console.error('Error deleting user account:', error)
    throw new Error('Failed to delete account')
  }
}