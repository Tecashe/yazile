import { client } from './prisma';
import { decryptToken } from './encrypt-whatsapp';

export class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;
  private accountId: string;

  constructor(accessToken: string, phoneNumberId: string, accountId: string) {
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
    this.accountId = accountId;
  }

  static async fromAccount(accountId: string): Promise<WhatsAppService | null> {
    const account = await client.whatsAppAccount.findUnique({
      where: { id: accountId }
    });

    if (!account) return null;

    const decryptedToken = decryptToken(account.accessToken);
    return new WhatsAppService(decryptedToken, account.businessPhoneNumberId, accountId);
  }

  async sendTextMessage(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: { body: message }
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp API error:', error);
        return { success: false, error: 'Failed to send message' };
      }

      const result = await response.json();
      const messageId = result.messages[0].id;

      // Log the message
      await client.whatsAppMessage.create({
        data: {
          whatsAppAccountId: this.accountId,
          messageId: messageId,
          waId: to,
          phoneNumber: to,
          messageType: 'text',
          content: message,
          direction: 'outbound',
          status: 'sent'
        }
      });

      return { success: true, messageId };

    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  async sendTemplateMessage(
    to: string, 
    templateName: string, 
    components?: any[]
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const payload: any = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' }
        }
      };

      if (components && components.length > 0) {
        payload.template.components = components;
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp API error:', error);
        return { success: false, error: 'Failed to send template message' };
      }

      const result = await response.json();
      const messageId = result.messages[0].id;

      // Log the message
      await client.whatsAppMessage.create({
        data: {
          whatsAppAccountId: this.accountId,
          messageId: messageId,
          waId: to,
          phoneNumber: to,
          messageType: 'template',
          content: `Template: ${templateName}`,
          direction: 'outbound',
          status: 'sent'
        }
      });

      return { success: true, messageId };

    } catch (error) {
      console.error('Error sending WhatsApp template:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  async sendMediaMessage(
    to: string, 
    mediaType: 'image' | 'document' | 'audio' | 'video',
    mediaUrl: string,
    caption?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const mediaObj: any = { link: mediaUrl };
      if (caption) mediaObj.caption = caption;

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: mediaType,
            [mediaType]: mediaObj
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp API error:', error);
        return { success: false, error: 'Failed to send media message' };
      }

      const result = await response.json();
      const messageId = result.messages[0].id;

      // Log the message
      await client.whatsAppMessage.create({
        data: {
          whatsAppAccountId: this.accountId,
          messageId: messageId,
          waId: to,
          phoneNumber: to,
          messageType: mediaType,
          content: caption || `[${mediaType.toUpperCase()}]`,
          direction: 'outbound',
          status: 'sent'
        }
      });

      return { success: true, messageId };

    } catch (error) {
      console.error('Error sending WhatsApp media:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  async getMessageTemplates(): Promise<{ success: boolean; templates?: any[]; error?: string }> {
    try {
      // Get WABA ID from account
      const account = await client.whatsAppAccount.findUnique({
        where: { id: this.accountId }
      });

      if (!account) {
        return { success: false, error: 'Account not found' };
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${account.wabaId}/message_templates?access_token=${this.accessToken}`
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp API error:', error);
        return { success: false, error: 'Failed to fetch templates' };
      }

      const result = await response.json();
      return { success: true, templates: result.data };

    } catch (error) {
      console.error('Error fetching WhatsApp templates:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  async createMessageTemplate(templateData: {
    name: string;
    category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
    components: any[];
  }): Promise<{ success: boolean; templateId?: string; error?: string }> {
    try {
      // Get WABA ID from account
      const account = await client.whatsAppAccount.findUnique({
        where: { id: this.accountId }
      });

      if (!account) {
        return { success: false, error: 'Account not found' };
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${account.wabaId}/message_templates`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: templateData.name,
            category: templateData.category,
            components: templateData.components,
            language: 'en'
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp API error:', error);
        return { success: false, error: 'Failed to create template' };
      }

      const result = await response.json();

      // Save template to database
      await client.whatsAppTemplate.create({
        data: {
          whatsAppAccountId: this.accountId,
          templateName: templateData.name,
          templateId: result.id,
          category: templateData.category,
          status: 'PENDING',
          bodyText: this.extractBodyText(templateData.components),
          headerText: this.extractHeaderText(templateData.components),
          footerText: this.extractFooterText(templateData.components)
        }
      });

      return { success: true, templateId: result.id };

    } catch (error) {
      console.error('Error creating WhatsApp template:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  async getPhoneNumberInfo(): Promise<{ success: boolean; info?: any; error?: string }> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}?access_token=${this.accessToken}`
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp API error:', error);
        return { success: false, error: 'Failed to get phone number info' };
      }

      const result = await response.json();
      return { success: true, info: result };

    } catch (error) {
      console.error('Error getting phone number info:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  async uploadMedia(file: File): Promise<{ success: boolean; mediaId?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type);
      formData.append('messaging_product', 'whatsapp');

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/media`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp API error:', error);
        return { success: false, error: 'Failed to upload media' };
      }

      const result = await response.json();
      return { success: true, mediaId: result.id };

    } catch (error) {
      console.error('Error uploading media:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  async getBusinessProfile(): Promise<{ success: boolean; profile?: any; error?: string }> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/whatsapp_business_profile?access_token=${this.accessToken}`
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp API error:', error);
        return { success: false, error: 'Failed to get business profile' };
      }

      const result = await response.json();
      return { success: true, profile: result.data[0] };

    } catch (error) {
      console.error('Error getting business profile:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  async updateBusinessProfile(profileData: {
    about?: string;
    address?: string;
    description?: string;
    email?: string;
    profile_picture_url?: string;
    websites?: string[];
    vertical?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/whatsapp_business_profile`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            ...profileData
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp API error:', error);
        return { success: false, error: 'Failed to update business profile' };
      }

      return { success: true };

    } catch (error) {
      console.error('Error updating business profile:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  // Helper methods for template parsing
  private extractBodyText(components: any[]): string {
    const bodyComponent = components.find(c => c.type === 'BODY');
    return bodyComponent?.text || '';
  }

  private extractHeaderText(components: any[]): string | null {
    const headerComponent = components.find(c => c.type === 'HEADER');
    return headerComponent?.text || null;
  }

  private extractFooterText(components: any[]): string | null {
    const footerComponent = components.find(c => c.type === 'FOOTER');
    return footerComponent?.text || null;
  }
}

// Helper functions for bulk operations
export async function sendBulkMessages(
  accountId: string,
  recipients: { phoneNumber: string; message: string }[]
): Promise<{ success: boolean; results: any[]; error?: string }> {
  try {
    const whatsApp = await WhatsAppService.fromAccount(accountId);
    if (!whatsApp) {
      return { success: false, results: [], error: 'WhatsApp account not found' };
    }

    const results = [];
    
    // Send messages with delay to avoid rate limiting
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const result = await whatsApp.sendTextMessage(recipient.phoneNumber, recipient.message);
      results.push({
        phoneNumber: recipient.phoneNumber,
        ...result
      });

      // Add delay between messages (1 second)
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { success: true, results };

  } catch (error) {
    console.error('Error sending bulk messages:', error);
    return { success: false, results: [], error: 'Internal server error' };
  }
}

export async function sendBulkTemplateMessages(
  accountId: string,
  recipients: string[],
  templateName: string,
  components?: any[]
): Promise<{ success: boolean; results: any[]; error?: string }> {
  try {
    const whatsApp = await WhatsAppService.fromAccount(accountId);
    if (!whatsApp) {
      return { success: false, results: [], error: 'WhatsApp account not found' };
    }

    const results = [];
    
    for (let i = 0; i < recipients.length; i++) {
      const phoneNumber = recipients[i];
      const result = await whatsApp.sendTemplateMessage(phoneNumber, templateName, components);
      results.push({
        phoneNumber,
        ...result
      });

      // Add delay between messages (2 seconds for templates)
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return { success: true, results };

  } catch (error) {
    console.error('Error sending bulk template messages:', error);
    return { success: false, results: [], error: 'Internal server error' };
  }
}