import { Utensils, Heart, Briefcase, Home, Laptop, Camera } from "lucide-react";

 const templateCategories = [
  {
    id: "food-service",
    name: "Food & Dining",
    icon: <Utensils className="h-4 w-4" />,
    description: "Restaurants, cafés, food trucks, catering",
    templates: [
      {
        id: "restaurant-comprehensive",
        title: "Full-Service Restaurant",
        description: "Complete template for restaurants with dine-in, takeout, and delivery",
        tags: ["restaurant", "dining", "food", "comprehensive"],
        content: `# [RESTAURANT_NAME] - Complete Restaurant Profile

## BASIC INFORMATION
- **Business Name:** [RESTAURANT_NAME]
- **Restaurant Type:** [Fine Dining/Casual Dining/Fast Casual/Family Restaurant]
- **Cuisine Type:** [Italian/Mexican/American/Asian/Fusion/etc.]
- **Established:** [YEAR]
- **Location:** [FULL_ADDRESS_WITH_CITY_STATE_ZIP]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **Social Media:** 
  - Instagram: [@INSTAGRAM_HANDLE]
  - Facebook: [FACEBOOK_PAGE]
  - TikTok: [@TIKTOK_HANDLE] (if applicable)

## HOURS OF OPERATION
- **Monday:** [HOURS or "Closed"]
- **Tuesday:** [HOURS or "Closed"]
- **Wednesday:** [HOURS or "Closed"]
- **Thursday:** [HOURS or "Closed"]
- **Friday:** [HOURS or "Closed"]
- **Saturday:** [HOURS or "Closed"]
- **Sunday:** [HOURS or "Closed"]
- **Holiday Hours:** [SPECIAL_HOLIDAY_SCHEDULE]

## RESTAURANT OVERVIEW
[RESTAURANT_NAME] is a [ATMOSPHERE_DESCRIPTION] [CUISINE_TYPE] restaurant located in [NEIGHBORHOOD/CITY]. Since [YEAR], we've been serving [TARGET_AUDIENCE] with [UNIQUE_SELLING_PROPOSITION]. 

Our restaurant specializes in [SPECIALTY_DISHES/COOKING_METHODS] and prides itself on [WHAT_MAKES_YOU_SPECIAL - e.g., farm-to-table ingredients, family recipes, authentic preparation methods].

**What Makes Us Special:**
- [UNIQUE_FEATURE_1 - e.g., Wood-fired pizza oven]
- [UNIQUE_FEATURE_2 - e.g., Locally sourced ingredients]
- [UNIQUE_FEATURE_3 - e.g., Family recipes passed down 3 generations]

## MENU HIGHLIGHTS

### APPETIZERS
- **[APPETIZER_1]:** [DESCRIPTION] - $[PRICE]
- **[APPETIZER_2]:** [DESCRIPTION] - $[PRICE]
- **[SIGNATURE_APPETIZER]:** [DETAILED_DESCRIPTION] - $[PRICE] ⭐ *Customer Favorite*

### MAIN COURSES
- **[MAIN_DISH_1]:** [DESCRIPTION] - $[PRICE]
- **[MAIN_DISH_2]:** [DESCRIPTION] - $[PRICE]
- **[SIGNATURE_DISH]:** [DETAILED_DESCRIPTION] - $[PRICE] ⭐ *Chef's Special*

### DESSERTS
- **[DESSERT_1]:** [DESCRIPTION] - $[PRICE]
- **[HOUSE_SPECIAL_DESSERT]:** [DESCRIPTION] - $[PRICE]

### BEVERAGES
- **Wine Selection:** [WINE_PROGRAM_DESCRIPTION] - $[PRICE_RANGE]
- **Craft Cocktails:** [COCKTAIL_PROGRAM_DESCRIPTION] - $[PRICE_RANGE]
- **Beer:** [BEER_SELECTION] - $[PRICE_RANGE]
- **Non-Alcoholic:** [OPTIONS] - $[PRICE_RANGE]

### DIETARY ACCOMMODATIONS
- **Vegetarian Options:** [NUMBER] dishes available
- **Vegan Options:** [NUMBER] dishes available
- **Gluten-Free Options:** [NUMBER] dishes available
- **Allergen Information:** We can accommodate [LIST_ALLERGENS] - please inform your server

## DINING OPTIONS
- **Dine-In:** [SEATING_CAPACITY] seats, [ATMOSPHERE_DESCRIPTION]
- **Takeout:** Available during all operating hours
- **Delivery:** Available through [DELIVERY_PLATFORMS] within [DELIVERY_RADIUS]
- **Catering:** Available for events of [MINIMUM_PEOPLE]+ people
- **Private Events:** [PRIVATE_DINING_CAPACITY] for special occasions

## RESERVATIONS & POLICIES
- **Reservations:** [ACCEPTED/WALK-IN_ONLY] via [BOOKING_METHOD]
- **Large Parties:** Parties of [NUMBER]+ require advance notice
- **Cancellation Policy:** [POLICY_DETAILS]
- **Dress Code:** [DRESS_CODE or "Casual"]
- **Children Policy:** [CHILDREN_WELCOME/RESTRICTIONS]
- **Pet Policy:** [PET_POLICY]

## PRICING & PAYMENT
- **Average Meal Cost:** $[PRICE_RANGE] per person
- **Payment Methods:** Cash, Credit/Debit Cards, Apple Pay, Google Pay
- **Gratuity:** [GRATUITY_POLICY]
- **Group Discounts:** [AVAILABLE/NOT_AVAILABLE]

## SPECIAL SERVICES
- **Happy Hour:** [DAYS_AND_TIMES] - [SPECIAL_OFFERS]
- **Daily Specials:** [DESCRIPTION_OF_DAILY_SPECIALS]
- **Seasonal Menu:** Updated [FREQUENCY] with seasonal ingredients
- **Wine Pairing:** Available with [SPECIFIC_DISHES]
- **Chef's Table:** [AVAILABILITY_AND_DESCRIPTION]

## LOCATION & ACCESSIBILITY
- **Parking:** [PARKING_OPTIONS_AND_AVAILABILITY]
- **Public Transportation:** [NEAREST_TRANSIT_OPTIONS]
- **Accessibility:** [WHEELCHAIR_ACCESSIBLE/ADA_COMPLIANT_FEATURES]
- **Nearby Landmarks:** [NOTABLE_NEARBY_LOCATIONS]

## TEAM
- **Head Chef:** [CHEF_NAME] - [BACKGROUND_AND_SPECIALTIES]
- **Restaurant Manager:** [MANAGER_NAME] - [EXPERIENCE]
- **Sommelier:** [NAME] - [WINE_EXPERTISE] (if applicable)

## FREQUENTLY ASKED QUESTIONS

**Q: Do you take reservations?**
A: [DETAILED_RESERVATION_POLICY]

**Q: Do you accommodate dietary restrictions?**
A: [DETAILED_DIETARY_ACCOMMODATION_POLICY]

**Q: Is there parking available?**
A: [DETAILED_PARKING_INFORMATION]

**Q: Do you have a kids menu?**
A: [KIDS_MENU_INFORMATION]

**Q: Can you host private events?**
A: [PRIVATE_EVENT_CAPABILITIES_AND_PROCESS]

**Q: Do you offer catering services?**
A: [CATERING_SERVICES_DETAILS]

**Q: What's your corkage policy?**
A: [CORKAGE_POLICY_IF_APPLICABLE]

## CUSTOMER REVIEWS & TESTIMONIALS
- *"[CUSTOMER_TESTIMONIAL_1]"* - [CUSTOMER_NAME], [REVIEW_SOURCE]
- *"[CUSTOMER_TESTIMONIAL_2]"* - [CUSTOMER_NAME], [REVIEW_SOURCE]
- *"[CUSTOMER_TESTIMONIAL_3]"* - [CUSTOMER_NAME], [REVIEW_SOURCE]

## AWARDS & RECOGNITION
- [AWARD_1] - [YEAR]
- [AWARD_2] - [YEAR]
- [MEDIA_MENTION] - [PUBLICATION], [YEAR]

## COMMUNITY INVOLVEMENT
- [COMMUNITY_INITIATIVE_1]
- [CHARITY_PARTNERSHIP]
- [LOCAL_SOURCING_COMMITMENT]

## CONTACT FOR INQUIRIES
- **General Manager:** [NAME] - [EMAIL] - [PHONE]
- **Event Coordinator:** [NAME] - [EMAIL] - [PHONE]
- **Catering Manager:** [NAME] - [EMAIL] - [PHONE]`,
      },
      {
        id: "cafe-coffee-shop",
        title: "Café & Coffee Shop",
        description: "Perfect for coffee shops, cafés, and casual dining spots",
        tags: ["café", "coffee", "casual", "breakfast"],
        content: `# [CAFE_NAME] - Coffee Shop & Café Profile

## BASIC INFORMATION
- **Business Name:** [CAFE_NAME]
- **Type:** [Coffee Shop/Café/Bakery Café/Specialty Coffee]
- **Established:** [YEAR]
- **Location:** [FULL_ADDRESS]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **Social Media:** [@INSTAGRAM] | [FACEBOOK_PAGE]

## HOURS OF OPERATION
- **Monday-Friday:** [WEEKDAY_HOURS]
- **Saturday:** [SATURDAY_HOURS]
- **Sunday:** [SUNDAY_HOURS]
- **Holiday Hours:** [HOLIDAY_SCHEDULE]

## CAFÉ OVERVIEW
[CAFE_NAME] is a [COZY/MODERN/RUSTIC] neighborhood café specializing in [SPECIALTY - e.g., artisan coffee, fresh pastries, healthy breakfast options]. Since [YEAR], we've been the go-to spot for [TARGET_AUDIENCE] looking for [VALUE_PROPOSITION].

**What We're Known For:**
- [SPECIALTY_1 - e.g., Single-origin coffee roasted in-house]
- [SPECIALTY_2 - e.g., Fresh-baked pastries daily]
- [SPECIALTY_3 - e.g., Cozy atmosphere perfect for work/study]

## COFFEE & BEVERAGES

### COFFEE MENU
- **Espresso:** $[PRICE]
- **Americano:** $[PRICE]
- **Cappuccino:** $[PRICE]
- **Latte:** $[PRICE] (Available with [MILK_OPTIONS])
- **Specialty Drinks:** [LIST_SIGNATURE_DRINKS] - $[PRICE_RANGE]

### ALTERNATIVE BEVERAGES
- **Tea Selection:** [TEA_VARIETIES] - $[PRICE_RANGE]
- **Cold Brew:** $[PRICE]
- **Smoothies:** [FLAVORS_AVAILABLE] - $[PRICE_RANGE]
- **Fresh Juices:** [JUICE_OPTIONS] - $[PRICE_RANGE]

### MILK & DIETARY OPTIONS
- **Milk Alternatives:** [ALMOND/OAT/SOY/COCONUT] - Additional $[PRICE]
- **Sugar-Free Syrups:** [AVAILABLE_FLAVORS]
- **Decaf Options:** Available for all coffee drinks

## FOOD MENU

### BREAKFAST
- **[BREAKFAST_ITEM_1]:** [DESCRIPTION] - $[PRICE]
- **[BREAKFAST_ITEM_2]:** [DESCRIPTION] - $[PRICE]
- **Fresh Pastries:** [DAILY_SELECTION] - $[PRICE_RANGE]

### LUNCH
- **Sandwiches:** [SANDWICH_OPTIONS] - $[PRICE_RANGE]
- **Salads:** [SALAD_OPTIONS] - $[PRICE_RANGE]
- **Soups:** [DAILY_SOUP_PROGRAM] - $[PRICE]

### SNACKS & TREATS
- **Baked Goods:** [MUFFINS/COOKIES/SCONES] - $[PRICE_RANGE]
- **Healthy Options:** [YOGURT_PARFAITS/FRUIT_BOWLS] - $[PRICE_RANGE]

## SERVICES & AMENITIES
- **Free WiFi:** High-speed internet throughout
- **Seating:** [NUMBER] seats including [SEATING_TYPES]
- **Takeout:** All items available to-go
- **Mobile Ordering:** Available through [APP/WEBSITE]
- **Loyalty Program:** [PROGRAM_DETAILS]
- **Catering:** Available for [OFFICE_MEETINGS/EVENTS]

## ATMOSPHERE & SPACE
- **Ambiance:** [DESCRIPTION_OF_ATMOSPHERE]
- **Work-Friendly:** [LAPTOP_POLICY] with plenty of outlets
- **Study Space:** [QUIET_AREAS/STUDY_POLICIES]
- **Meeting Space:** [AVAILABILITY_OF_MEETING_AREAS]
- **Outdoor Seating:** [PATIO/SIDEWALK_SEATING_DETAILS]

## SPECIAL PROGRAMS
- **Daily Specials:** [DESCRIPTION_OF_DAILY_OFFERS]
- **Happy Hour:** [DISCOUNTED_DRINKS_TIMES]
- **Student Discount:** [DISCOUNT_PERCENTAGE] with valid ID
- **Local Business Discount:** [DISCOUNT_FOR_LOCAL_EMPLOYEES]
- **Bulk Orders:** Discounts available for orders of [QUANTITY]+

## POLICIES
- **Payment:** Cash, Credit/Debit, Apple Pay, Google Pay
- **Tipping:** [TIPPING_POLICY]
- **Outside Food:** [POLICY_ON_OUTSIDE_FOOD]
- **Laptop/Study Policy:** [PEAK_HOURS_POLICY]
- **Group Reservations:** [LARGE_GROUP_POLICY]

## FREQUENTLY ASKED QUESTIONS

**Q: Do you have WiFi?**
A: Yes, we offer free high-speed WiFi to all customers.

**Q: Can I work/study here?**
A: [LAPTOP_AND_STUDY_POLICY_DETAILS]

**Q: Do you have dairy-free options?**
A: [DAIRY_FREE_MILK_AND_FOOD_OPTIONS]

**Q: Do you take custom orders for events?**
A: [CATERING_AND_CUSTOM_ORDER_POLICY]

**Q: What are your busiest hours?**
A: [PEAK_HOURS_INFORMATION]

## CUSTOMER TESTIMONIALS
- *"[TESTIMONIAL_ABOUT_COFFEE_QUALITY]"* - [CUSTOMER_NAME]
- *"[TESTIMONIAL_ABOUT_ATMOSPHERE]"* - [CUSTOMER_NAME]
- *"[TESTIMONIAL_ABOUT_SERVICE]"* - [CUSTOMER_NAME]

## CONTACT
- **Manager:** [MANAGER_NAME] - [EMAIL]
- **Catering Inquiries:** [CATERING_EMAIL]
- **General Questions:** [GENERAL_EMAIL]`,
      },
    ],
  },
  {
    id: "health-wellness",
    name: "Health & Wellness",
    icon: <Heart className="h-4 w-4" />,
    description: "Gyms, spas, clinics, wellness centers",
    templates: [
      {
        id: "fitness-gym",
        title: "Fitness Center & Gym",
        description: "Comprehensive template for gyms, fitness centers, and health clubs",
        tags: ["fitness", "gym", "health", "wellness"],
        content: `# [GYM_NAME] - Fitness Center Profile

## BASIC INFORMATION
- **Business Name:** [GYM_NAME]
- **Type:** [Full-Service Gym/Boutique Fitness/CrossFit/Yoga Studio/etc.]
- **Established:** [YEAR]
- **Location:** [FULL_ADDRESS]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **Social Media:** [@INSTAGRAM] | [FACEBOOK_PAGE] | [@TIKTOK]

## HOURS OF OPERATION
- **Monday-Thursday:** [WEEKDAY_HOURS]
- **Friday:** [FRIDAY_HOURS]
- **Saturday:** [SATURDAY_HOURS]
- **Sunday:** [SUNDAY_HOURS]
- **Holiday Hours:** [HOLIDAY_SCHEDULE]
- **24/7 Access:** [AVAILABLE/NOT_AVAILABLE] for [MEMBERSHIP_LEVELS]

## GYM OVERVIEW
[GYM_NAME] is a [SIZE] fitness facility dedicated to helping members achieve their health and fitness goals. Since [YEAR], we've been serving the [COMMUNITY_NAME] community with [UNIQUE_APPROACH_TO_FITNESS].

**Our Mission:** [MISSION_STATEMENT]

**What Sets Us Apart:**
- [UNIQUE_FEATURE_1 - e.g., State-of-the-art equipment]
- [UNIQUE_FEATURE_2 - e.g., Certified personal trainers]
- [UNIQUE_FEATURE_3 - e.g., Supportive community atmosphere]

## FACILITIES & EQUIPMENT

### CARDIO EQUIPMENT
- **Treadmills:** [NUMBER] units including [FEATURES]
- **Elliptical Machines:** [NUMBER] units
- **Stationary Bikes:** [NUMBER] units ([UPRIGHT/RECUMBENT/SPIN])
- **Rowing Machines:** [NUMBER] units
- **Stair Climbers:** [NUMBER] units

### STRENGTH TRAINING
- **Free Weights:** Complete dumbbell set [WEIGHT_RANGE]
- **Barbells & Olympic Plates:** [EQUIPMENT_DETAILS]
- **Cable Machines:** [NUMBER] stations
- **Resistance Machines:** [BRAND/TYPE] covering all muscle groups
- **Functional Training Area:** [DESCRIPTION_OF_FUNCTIONAL_SPACE]

### SPECIALIZED AREAS
- **Group Fitness Studio:** [SIZE] with [AUDIO/VISUAL_EQUIPMENT]
- **Yoga/Pilates Studio:** [DEDICATED_SPACE_DETAILS]
- **Cycling Studio:** [NUMBER] bikes with [TECHNOLOGY_FEATURES]
- **Pool:** [POOL_DETAILS] (if applicable)
- **Sauna/Steam Room:** [AMENITY_DETAILS] (if applicable)
- **Basketball/Racquetball Courts:** [COURT_DETAILS] (if applicable)

## MEMBERSHIP OPTIONS

### MEMBERSHIP TYPES
1. **[BASIC_MEMBERSHIP_NAME]:** $[MONTHLY_PRICE]/month
   - [INCLUDED_FEATURES]
   - [ACCESS_HOURS]
   - [ADDITIONAL_BENEFITS]

2. **[PREMIUM_MEMBERSHIP_NAME]:** $[MONTHLY_PRICE]/month
   - [ALL_BASIC_FEATURES]
   - [ADDITIONAL_PREMIUM_FEATURES]
   - [GUEST_PRIVILEGES]

3. **[VIP_MEMBERSHIP_NAME]:** $[MONTHLY_PRICE]/month
   - [ALL_PREMIUM_FEATURES]
   - [VIP_EXCLUSIVE_BENEFITS]
   - [PERSONAL_TRAINING_CREDITS]

### MEMBERSHIP BENEFITS
- **No Enrollment Fee:** [PROMOTIONAL_PERIODS]
- **Month-to-Month:** No long-term contracts required
- **Guest Passes:** [NUMBER] per month for [MEMBERSHIP_LEVELS]
- **Reciprocal Access:** [PARTNER_GYM_LOCATIONS] (if applicable)
- **Member Discounts:** [RETAIL/SERVICE_DISCOUNTS]

## GROUP FITNESS CLASSES

### CLASS SCHEDULE
**Monday:**
- [TIME]: [CLASS_NAME] with [INSTRUCTOR]
- [TIME]: [CLASS_NAME] with [INSTRUCTOR]

**Tuesday:**
- [TIME]: [CLASS_NAME] with [INSTRUCTOR]
- [TIME]: [CLASS_NAME] with [INSTRUCTOR]

[Continue for all days...]

### POPULAR CLASSES
- **[CLASS_TYPE_1]:** [DESCRIPTION_AND_BENEFITS] - [DIFFICULTY_LEVEL]
- **[CLASS_TYPE_2]:** [DESCRIPTION_AND_BENEFITS] - [DIFFICULTY_LEVEL]
- **[CLASS_TYPE_3]:** [DESCRIPTION_AND_BENEFITS] - [DIFFICULTY_LEVEL]

### CLASS POLICIES
- **Reservations:** [REQUIRED/FIRST_COME_FIRST_SERVED]
- **Cancellation:** [CANCELLATION_POLICY]
- **Late Arrival:** [LATE_ARRIVAL_POLICY]
- **Class Size:** Maximum [NUMBER] participants

## PERSONAL TRAINING

### TRAINING OPTIONS
- **One-on-One Training:** $[PRICE] per session
- **Semi-Private Training:** $[PRICE] per person (2-3 people)
- **Small Group Training:** $[PRICE] per person (4-6 people)
- **Specialized Programs:** [SPORT_SPECIFIC/REHABILITATION/etc.]

### TRAINER QUALIFICATIONS
All trainers are certified through [CERTIFICATION_BODIES] and specialize in:
- [SPECIALIZATION_1]
- [SPECIALIZATION_2]
- [SPECIALIZATION_3]

### TRAINING PACKAGES
- **4 Sessions:** $[PRICE] ([SAVINGS] vs. individual)
- **8 Sessions:** $[PRICE] ([SAVINGS] vs. individual)
- **12 Sessions:** $[PRICE] ([SAVINGS] vs. individual)

## ADDITIONAL SERVICES
- **Nutritional Counseling:** [AVAILABLE/PRICING]
- **Body Composition Analysis:** [AVAILABLE/PRICING]
- **Massage Therapy:** [AVAILABLE/PRICING]
- **Physical Therapy:** [AVAILABLE/PRICING]
- **Childcare:** [AVAILABLE_HOURS_AND_PRICING]

## POLICIES & PROCEDURES

### GYM ETIQUETTE
- **Equipment Sharing:** [SHARING_POLICY]
- **Cleaning:** [EQUIPMENT_CLEANING_REQUIREMENTS]
- **Dress Code:** [APPROPRIATE_WORKOUT_ATTIRE]
- **Cell Phone Use:** [CELL_PHONE_POLICY]
- **Music:** [PERSONAL_MUSIC_POLICY]

### SAFETY POLICIES
- **Equipment Orientation:** [REQUIRED/AVAILABLE]
- **Spotting Policy:** [SPOTTING_ASSISTANCE_POLICY]
- **Injury Protocol:** [INJURY_REPORTING_PROCEDURE]
- **Emergency Procedures:** [EMERGENCY_CONTACT_INFO]

### MEMBERSHIP POLICIES
- **Freezing Membership:** [FREEZE_POLICY_AND_FEES]
- **Cancellation:** [CANCELLATION_REQUIREMENTS]
- **Guest Policy:** [GUEST_PASS_RULES]
- **Age Requirements:** [MINIMUM_AGE_POLICIES]

## FREQUENTLY ASKED QUESTIONS

**Q: Do you offer day passes?**
A: [DAY_PASS_AVAILABILITY_AND_PRICING]

**Q: Can I freeze my membership?**
A: [MEMBERSHIP_FREEZE_POLICY_DETAILS]

**Q: Do you have childcare?**
A: [CHILDCARE_SERVICES_DETAILS]

**Q: What if I'm new to working out?**
A: [NEW_MEMBER_ORIENTATION_AND_SUPPORT]

**Q: Do you have locker rooms and showers?**
A: [LOCKER_ROOM_AMENITIES_DETAILS]

**Q: Can I bring a friend?**
A: [GUEST_POLICY_DETAILS]

## SUCCESS STORIES
- *"[MEMBER_SUCCESS_STORY_1]"* - [MEMBER_NAME]
- *"[MEMBER_SUCCESS_STORY_2]"* - [MEMBER_NAME]
- *"[MEMBER_SUCCESS_STORY_3]"* - [MEMBER_NAME]

## CONTACT INFORMATION
- **General Manager:** [NAME] - [EMAIL] - [PHONE]
- **Membership Director:** [NAME] - [EMAIL] - [PHONE]
- **Personal Training Director:** [NAME] - [EMAIL] - [PHONE]
- **Group Fitness Coordinator:** [NAME] - [EMAIL] - [PHONE]`,
      },
      {
        id: "spa-wellness",
        title: "Spa & Wellness Center",
        description: "Perfect for day spas, wellness centers, and beauty treatment facilities",
        tags: ["spa", "wellness", "beauty", "relaxation"],
        content: `# [SPA_NAME] - Wellness & Spa Profile

## BASIC INFORMATION
- **Business Name:** [SPA_NAME]
- **Type:** [Day Spa/Medical Spa/Wellness Center/Beauty Spa]
- **Established:** [YEAR]
- **Location:** [FULL_ADDRESS]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **Social Media:** [@INSTAGRAM] | [FACEBOOK_PAGE]

## HOURS OF OPERATION
- **Monday:** [HOURS or "Closed"]
- **Tuesday:** [HOURS]
- **Wednesday:** [HOURS]
- **Thursday:** [HOURS]
- **Friday:** [HOURS]
- **Saturday:** [HOURS]
- **Sunday:** [HOURS or "Closed"]

## SPA OVERVIEW
[SPA_NAME] is a tranquil [TYPE_OF_SPA] dedicated to providing rejuvenating treatments and wellness services. Since [YEAR], we've been helping clients achieve [WELLNESS_GOALS] through our comprehensive menu of [TREATMENT_SPECIALTIES].

**Our Philosophy:** [SPA_PHILOSOPHY_STATEMENT]

**What Makes Us Special:**
- [UNIQUE_FEATURE_1 - e.g., Organic, locally-sourced products]
- [UNIQUE_FEATURE_2 - e.g., Licensed massage therapists and estheticians]
- [UNIQUE_FEATURE_3 - e.g., Serene, peaceful environment]

## TREATMENT MENU

### FACIAL TREATMENTS
- **[SIGNATURE_FACIAL]:** [DETAILED_DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Classic European Facial:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Anti-Aging Facial:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Acne Treatment Facial:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Hydrating Facial:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)

### MASSAGE THERAPY
- **Swedish Massage:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Deep Tissue Massage:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Hot Stone Massage:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Prenatal Massage:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Couples Massage:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)

### BODY TREATMENTS
- **Body Wrap:** [DESCRIPTION_AND_BENEFITS] - $[PRICE] ([DURATION] minutes)
- **Body Scrub:** [DESCRIPTION_AND_BENEFITS] - $[PRICE] ([DURATION] minutes)
- **Cellulite Treatment:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)

### SPECIALTY SERVICES
- **[SPECIALTY_SERVICE_1]:** [DESCRIPTION] - $[PRICE]
- **[SPECIALTY_SERVICE_2]:** [DESCRIPTION] - $[PRICE]
- **Add-On Services:** [LIST_OF_ENHANCEMENT_OPTIONS] - $[PRICE_RANGE]

## SPA PACKAGES

### SIGNATURE PACKAGES
1. **[PACKAGE_NAME_1]:** [SERVICES_INCLUDED] - $[PACKAGE_PRICE] (Save $[SAVINGS])
2. **[PACKAGE_NAME_2]:** [SERVICES_INCLUDED] - $[PACKAGE_PRICE] (Save $[SAVINGS])
3. **[PACKAGE_NAME_3]:** [SERVICES_INCLUDED] - $[PACKAGE_PRICE] (Save $[SAVINGS])

### SEASONAL PACKAGES
- **[SEASONAL_PACKAGE]:** [DESCRIPTION_AND_SERVICES] - $[PRICE]
- Available [SEASON/MONTHS]

## FACILITIES & AMENITIES
- **Treatment Rooms:** [NUMBER] private rooms with [AMENITIES]
- **Relaxation Area:** [DESCRIPTION_OF_RELAXATION_SPACE]
- **Changing Rooms:** [AMENITIES_PROVIDED]
- **Steam Room/Sauna:** [AVAILABLE/NOT_AVAILABLE]
- **Retail Area:** [PRODUCT_LINES_CARRIED]
- **Parking:** [PARKING_AVAILABILITY]

## BOOKING & POLICIES

### APPOINTMENT BOOKING
- **Online Booking:** Available 24/7 at [WEBSITE_URL]
- **Phone Booking:** [PHONE_NUMBER] during business hours
- **Mobile App:** [APP_NAME] available for [iOS/ANDROID]

### SPA POLICIES
- **Arrival Time:** Please arrive [TIME] minutes before your appointment
- **Cancellation Policy:** [CANCELLATION_TIMEFRAME] notice required
- **Late Arrival:** [LATE_ARRIVAL_POLICY]
- **Gratuity:** [GRATUITY_POLICY]
- **Age Policy:** [MINIMUM_AGE_REQUIREMENTS]

### PAYMENT & PRICING
- **Payment Methods:** Cash, Credit/Debit Cards, Gift Cards
- **Package Pricing:** [PACKAGE_DISCOUNT_STRUCTURE]
- **Membership Programs:** [MEMBERSHIP_BENEFITS_IF_AVAILABLE]
- **Group Discounts:** Available for groups of [NUMBER]+

## PRODUCTS & RETAIL
We carry premium skincare and wellness products including:
- **[PRODUCT_LINE_1]:** [DESCRIPTION_OF_PRODUCTS]
- **[PRODUCT_LINE_2]:** [DESCRIPTION_OF_PRODUCTS]
- **[PRODUCT_LINE_3]:** [DESCRIPTION_OF_PRODUCTS]

**Product Guarantee:** [RETURN_POLICY_FOR_RETAIL_PRODUCTS]

## THERAPIST TEAM
Our licensed professionals include:
- **[THERAPIST_NAME_1]:** [SPECIALIZATIONS_AND_CERTIFICATIONS]
- **[THERAPIST_NAME_2]:** [SPECIALIZATIONS_AND_CERTIFICATIONS]
- **[THERAPIST_NAME_3]:** [SPECIALIZATIONS_AND_CERTIFICATIONS]

All therapists are licensed and certified in [STATE] and participate in ongoing education.

## SPECIAL PROGRAMS
- **Bridal Services:** [BRIDAL_PACKAGE_DETAILS]
- **Corporate Wellness:** [CORPORATE_PROGRAM_DETAILS]
- **Membership Program:** [MEMBERSHIP_BENEFITS_AND_PRICING]
- **Loyalty Rewards:** [LOYALTY_PROGRAM_DETAILS]

## FREQUENTLY ASKED QUESTIONS

**Q: What should I expect during my first visit?**
A: [FIRST_VISIT_PROCESS_DESCRIPTION]

**Q: What should I wear to my appointment?**
A: [ATTIRE_RECOMMENDATIONS]

**Q: Can I request a specific therapist?**
A: [THERAPIST_REQUEST_POLICY]

**Q: Do you offer couples treatments?**
A: [COUPLES_TREATMENT_AVAILABILITY]

**Q: What is your cancellation policy?**
A: [DETAILED_CANCELLATION_POLICY]

**Q: Do you offer gift certificates?**
A: [GIFT_CERTIFICATE_INFORMATION]

## CLIENT TESTIMONIALS
- *"[TESTIMONIAL_ABOUT_RELAXATION]"* - [CLIENT_NAME]
- *"[TESTIMONIAL_ABOUT_RESULTS]"* - [CLIENT_NAME]
- *"[TESTIMONIAL_ABOUT_SERVICE]"* - [CLIENT_NAME]

## CONTACT FOR APPOINTMENTS
- **Spa Reception:** [PHONE] - [EMAIL]
- **Spa Director:** [NAME] - [EMAIL]
- **Group Bookings:** [EMAIL]
- **Gift Certificate Sales:** [PHONE/EMAIL]`,
      },
    ],
  },
  {
    id: "professional-services",
    name: "Professional Services",
    icon: <Briefcase className="h-4 w-4" />,
    description: "Law firms, accounting, consulting, real estate",
    templates: [
      {
        id: "law-firm",
        title: "Law Firm & Legal Services",
        description: "Comprehensive template for law firms and legal practitioners",
        tags: ["law", "legal", "attorney", "professional"],
        content: `# [LAW_FIRM_NAME] - Legal Services Profile

## FIRM INFORMATION
- **Firm Name:** [LAW_FIRM_NAME]
- **Practice Type:** [Solo Practice/Small Firm/Mid-Size Firm/Boutique Firm]
- **Established:** [YEAR]
- **Location:** [FULL_ADDRESS]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **LinkedIn:** [LINKEDIN_PROFILE]

## OFFICE HOURS
- **Monday-Friday:** [BUSINESS_HOURS]
- **Saturday:** [WEEKEND_HOURS or "By Appointment Only"]
- **Sunday:** [WEEKEND_HOURS or "Closed"]
- **Emergency Contact:** [EMERGENCY_CONTACT_INFO]

## FIRM OVERVIEW
[LAW_FIRM_NAME] is a [FIRM_SIZE] law firm specializing in [PRIMARY_PRACTICE_AREAS]. Since [YEAR], we have been providing [CLIENT_TYPE] with comprehensive legal services throughout [GEOGRAPHIC_AREA].

**Our Mission:** [MISSION_STATEMENT]

**Our Approach:** [DESCRIPTION_OF_LEGAL_PHILOSOPHY_AND_CLIENT_SERVICE_APPROACH]

## PRACTICE AREAS

### PRIMARY PRACTICE AREAS
1. **[PRACTICE_AREA_1]**
   - [SPECIFIC_SERVICE_1]
   - [SPECIFIC_SERVICE_2]
   - [SPECIFIC_SERVICE_3]
   - Typical case value: $[RANGE]

2. **[PRACTICE_AREA_2]**
   - [SPECIFIC_SERVICE_1]
   - [SPECIFIC_SERVICE_2]
   - [SPECIFIC_SERVICE_3]
   - Typical case value: $[RANGE]

3. **[PRACTICE_AREA_3]**
   - [SPECIFIC_SERVICE_1]
   - [SPECIFIC_SERVICE_2]
   - [SPECIFIC_SERVICE_3]
   - Typical case value: $[RANGE]

### ADDITIONAL SERVICES
- **[ADDITIONAL_SERVICE_1]:** [DESCRIPTION]
- **[ADDITIONAL_SERVICE_2]:** [DESCRIPTION]
- **Legal Document Review:** [PRICING_STRUCTURE]
- **Legal Consultation:** [CONSULTATION_DETAILS]

## ATTORNEY PROFILES

### [ATTORNEY_NAME_1] - [TITLE]
- **Education:** [LAW_SCHOOL], [DEGREE], [YEAR]
- **Bar Admissions:** [STATE_BARS_AND_YEARS]
- **Experience:** [YEARS] years practicing law
- **Specializations:** [AREAS_OF_EXPERTISE]
- **Notable Cases/Achievements:** [SIGNIFICANT_CASES_OR_RECOGNITION]
- **Professional Memberships:** [BAR_ASSOCIATIONS_AND_ORGANIZATIONS]

### [ATTORNEY_NAME_2] - [TITLE]
- **Education:** [LAW_SCHOOL], [DEGREE], [YEAR]
- **Bar Admissions:** [STATE_BARS_AND_YEARS]
- **Experience:** [YEARS] years practicing law
- **Specializations:** [AREAS_OF_EXPERTISE]
- **Notable Cases/Achievements:** [SIGNIFICANT_CASES_OR_RECOGNITION]

## CLIENT SERVICES

### CONSULTATION PROCESS
1. **Initial Contact:** [HOW_CLIENTS_REACH_OUT]
2. **Case Evaluation:** [EVALUATION_PROCESS]
3. **Fee Discussion:** [FEE_STRUCTURE_EXPLANATION]
4. **Engagement:** [RETAINER_AND_ENGAGEMENT_PROCESS]
5. **Ongoing Communication:** [CLIENT_COMMUNICATION_PRACTICES]

### CONSULTATION OPTIONS
- **In-Person Consultation:** [DURATION] - $[FEE]
- **Phone Consultation:** [DURATION] - $[FEE]
- **Video Consultation:** [DURATION] - $[FEE]
- **Free Initial Consultation:** [AVAILABLE_FOR_WHICH_CASES]

## FEE STRUCTURE

### BILLING METHODS
- **Hourly Rate:** $[RATE_RANGE] depending on attorney and case complexity
- **Flat Fee Services:** [LIST_OF_FLAT_FEE_SERVICES_AND_PRICES]
- **Contingency Fee:** [PERCENTAGE]% for [APPLICABLE_CASE_TYPES]
- **Retainer:** [TYPICAL_RETAINER_AMOUNTS]

### PAYMENT POLICIES
- **Payment Methods:** Cash, Check, Credit Cards, Payment Plans
- **Payment Plans:** Available for [QUALIFYING_CASES]
- **Billing Frequency:** [MONTHLY/QUARTERLY]
- **Late Payment:** [LATE_PAYMENT_POLICY]

## CASE TYPES & EXPERIENCE

### [PRACTICE_AREA_1] CASES
**Typical Cases Include:**
- [CASE_TYPE_1]: [DESCRIPTION_AND_TYPICAL_OUTCOME]
- [CASE_TYPE_2]: [DESCRIPTION_AND_TYPICAL_OUTCOME]
- [CASE_TYPE_3]: [DESCRIPTION_AND_TYPICAL_OUTCOME]

**Recent Results:**
- [CASE_RESULT_1]
- [CASE_RESULT_2]
- [CASE_RESULT_3]

### [PRACTICE_AREA_2] CASES
**Typical Cases Include:**
- [CASE_TYPE_1]: [DESCRIPTION_AND_TYPICAL_OUTCOME]
- [CASE_TYPE_2]: [DESCRIPTION_AND_TYPICAL_OUTCOME]

## CLIENT COMMUNICATION
- **Regular Updates:** [UPDATE_FREQUENCY_AND_METHOD]
- **Document Sharing:** [SECURE_PORTAL/EMAIL_POLICY]
- **Emergency Contact:** [EMERGENCY_AVAILABILITY]
- **Language Services:** [LANGUAGES_SPOKEN_OR_TRANSLATION_SERVICES]

## FIRM POLICIES

### CONFIDENTIALITY
[ATTORNEY_CLIENT_PRIVILEGE_EXPLANATION_AND_CONFIDENTIALITY_PRACTICES]

### CONFLICT OF INTEREST
[CONFLICT_CHECK_PROCESS_AND_POLICIES]

### CASE ACCEPTANCE
[CRITERIA_FOR_ACCEPTING_CASES_AND_REFERRAL_PRACTICES]

## FREQUENTLY ASKED QUESTIONS

**Q: How much will my case cost?**
A: [DETAILED_EXPLANATION_OF_COST_FACTORS_AND_ESTIMATION_PROCESS]

**Q: How long will my case take?**
A: [EXPLANATION_OF_TIMELINE_FACTORS_FOR_DIFFERENT_CASE_TYPES]

**Q: Do you offer payment plans?**
A: [PAYMENT_PLAN_AVAILABILITY_AND_TERMS]

**Q: Will I work directly with the attorney?**
A: [EXPLANATION_OF_ATTORNEY_INVOLVEMENT_VS_STAFF_SUPPORT]

**Q: What should I bring to my first appointment?**
A: [LIST_OF_DOCUMENTS_AND_INFORMATION_TO_BRING]

**Q: Do you handle cases outside of [LOCAL_AREA]?**
A: [GEOGRAPHIC_SCOPE_OF_PRACTICE]

**Q: What happens if I'm not satisfied with the service?**
A: [CLIENT_SATISFACTION_POLICY_AND_RESOLUTION_PROCESS]

## CLIENT TESTIMONIALS
- *"[TESTIMONIAL_ABOUT_CASE_OUTCOME]"* - [CLIENT_INITIALS], [CASE_TYPE]
- *"[TESTIMONIAL_ABOUT_SERVICE_QUALITY]"* - [CLIENT_INITIALS], [CASE_TYPE]
- *"[TESTIMONIAL_ABOUT_COMMUNICATION]"* - [CLIENT_INITIALS], [CASE_TYPE]

## PROFESSIONAL RECOGNITION
- **Awards:** [LEGAL_AWARDS_AND_RECOGNITION]
- **Publications:** [LEGAL_PUBLICATIONS_OR_ARTICLES]
- **Speaking Engagements:** [CONFERENCES_OR_SEMINARS]
- **Professional Ratings:** [AVVO/MARTINDALE_HUBBELL_RATINGS]

## COMMUNITY INVOLVEMENT
- **Pro Bono Work:** [PRO_BONO_COMMITMENT_AND_CASES]
- **Community Organizations:** [COMMUNITY_INVOLVEMENT]
- **Legal Education:** [TEACHING_OR_MENTORING_ACTIVITIES]

## CONTACT INFORMATION
- **Main Office:** [PHONE] - [EMAIL]
- **[ATTORNEY_NAME_1]:** [DIRECT_PHONE] - [EMAIL]
- **[ATTORNEY_NAME_2]:** [DIRECT_PHONE] - [EMAIL]
- **Case Inquiries:** [INTAKE_EMAIL]
- **Billing Questions:** [BILLING_EMAIL]

## OFFICE LOCATION & ACCESSIBILITY
- **Address:** [FULL_ADDRESS_WITH_SUITE_NUMBER]
- **Parking:** [PARKING_AVAILABILITY_AND_INSTRUCTIONS]
- **Public Transportation:** [TRANSIT_OPTIONS]
- **Accessibility:** [ADA_COMPLIANCE_AND_ACCOMMODATIONS]
- **Nearby Landmarks:** [NOTABLE_NEARBY_LOCATIONS]`,
      },
    ],
  },
  {
    id: "home-services",
    name: "Home Services",
    icon: <Home className="h-4 w-4" />,
    description: "Cleaning, landscaping, contractors, home repair",
    templates: [
      {
        id: "home-cleaning",
        title: "Home Cleaning Service",
        description: "Perfect for residential and commercial cleaning services",
        tags: ["cleaning", "home", "residential", "commercial"],
        content: `# [CLEANING_COMPANY_NAME] - Professional Cleaning Services

## COMPANY INFORMATION
- **Business Name:** [CLEANING_COMPANY_NAME]
- **Service Type:** [Residential/Commercial/Both] Cleaning Services
- **Established:** [YEAR]
- **Service Area:** [CITIES_AND_RADIUS_SERVED]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **Social Media:** [@INSTAGRAM] | [FACEBOOK_PAGE]

## BUSINESS HOURS
- **Monday-Friday:** [BUSINESS_HOURS]
- **Saturday:** [WEEKEND_HOURS]
- **Sunday:** [WEEKEND_HOURS or "Closed"]
- **Emergency Services:** [AVAILABLE/NOT_AVAILABLE]
- **Holiday Schedule:** [HOLIDAY_AVAILABILITY]

## COMPANY OVERVIEW
[CLEANING_COMPANY_NAME] has been providing professional cleaning services to [SERVICE_AREA] since [YEAR]. We specialize in [CLEANING_SPECIALTIES] and pride ourselves on [UNIQUE_SELLING_POINTS].

**Our Mission:** [MISSION_STATEMENT]

**Why Choose Us:**
- [BENEFIT_1 - e.g., Bonded and insured team]
- [BENEFIT_2 - e.g., Eco-friendly cleaning products]
- [BENEFIT_3 - e.g., 100% satisfaction guarantee]
- [BENEFIT_4 - e.g., Flexible scheduling]

## RESIDENTIAL CLEANING SERVICES

### REGULAR CLEANING SERVICES
**Weekly Cleaning:** $[PRICE_RANGE] per visit
- [SERVICE_DETAIL_1]
- [SERVICE_DETAIL_2]
- [SERVICE_DETAIL_3]

**Bi-Weekly Cleaning:** $[PRICE_RANGE] per visit
- [SERVICE_DETAIL_1]
- [SERVICE_DETAIL_2]
- [SERVICE_DETAIL_3]

**Monthly Cleaning:** $[PRICE_RANGE] per visit
- [SERVICE_DETAIL_1]
- [SERVICE_DETAIL_2]
- [SERVICE_DETAIL_3]

### DEEP CLEANING SERVICES
**Initial Deep Clean:** $[PRICE_RANGE]
- [DETAILED_SERVICE_1]
- [DETAILED_SERVICE_2]
- [DETAILED_SERVICE_3]
- [DETAILED_SERVICE_4]

**Spring/Fall Deep Clean:** $[PRICE_RANGE]
- [SEASONAL_SERVICE_1]
- [SEASONAL_SERVICE_2]
- [SEASONAL_SERVICE_3]

### SPECIALTY CLEANING SERVICES
- **Move-In/Move-Out Cleaning:** $[PRICE_RANGE]
- **Post-Construction Cleanup:** $[PRICE_RANGE]
- **Window Cleaning:** $[PRICE] per window
- **Carpet Cleaning:** $[PRICE] per room
- **Upholstery Cleaning:** $[PRICE_RANGE]

## COMMERCIAL CLEANING SERVICES

### OFFICE CLEANING
**Daily Service:** $[PRICE_RANGE] per square foot
- [OFFICE_SERVICE_1]
- [OFFICE_SERVICE_2]
- [OFFICE_SERVICE_3]

**Weekly Service:** $[PRICE_RANGE] per square foot
- [OFFICE_SERVICE_1]
- [OFFICE_SERVICE_2]

### SPECIALIZED COMMERCIAL SERVICES
- **Medical Office Cleaning:** $[PRICE_RANGE]
- **Restaurant Cleaning:** $[PRICE_RANGE]
- **Retail Store Cleaning:** $[PRICE_RANGE]
- **Warehouse Cleaning:** $[PRICE_RANGE]

## CLEANING PROCESS

### STANDARD CLEANING INCLUDES
**Kitchen:**
- [KITCHEN_TASK_1]
- [KITCHEN_TASK_2]
- [KITCHEN_TASK_3]
- [KITCHEN_TASK_4]

**Bathrooms:**
- [BATHROOM_TASK_1]
- [BATHROOM_TASK_2]
- [BATHROOM_TASK_3]
- [BATHROOM_TASK_4]

**Living Areas:**
- [LIVING_AREA_TASK_1]
- [LIVING_AREA_TASK_2]
- [LIVING_AREA_TASK_3]

**Bedrooms:**
- [BEDROOM_TASK_1]
- [BEDROOM_TASK_2]
- [BEDROOM_TASK_3]

### QUALITY ASSURANCE
- [QUALITY_CHECK_1]
- [QUALITY_CHECK_2]
- [QUALITY_CHECK_3]

## PRICING STRUCTURE

### FACTORS AFFECTING PRICING
- **Home Size:** [PRICING_BY_SQUARE_FOOTAGE_OR_ROOMS]
- **Frequency:** [DISCOUNT_FOR_REGULAR_SERVICE]
- **Condition:** [ADDITIONAL_CHARGES_FOR_HEAVILY_SOILED_AREAS]
- **Special Requests:** [PRICING_FOR_ADDITIONAL_SERVICES]

### PRICING EXAMPLES
- **1-2 Bedroom Apartment:** $[PRICE_RANGE]
- **3-4 Bedroom House:** $[PRICE_RANGE]
- **5+ Bedroom House:** $[PRICE_RANGE]

### DISCOUNTS & PROMOTIONS
- **New Customer Discount:** [DISCOUNT_PERCENTAGE]% off first cleaning
- **Referral Program:** [REFERRAL_REWARD_DETAILS]
- **Senior/Military Discount:** [DISCOUNT_PERCENTAGE]%
- **Regular Service Discount:** [DISCOUNT_FOR_WEEKLY_BIWEEKLY_SERVICE]

## BOOKING & SCHEDULING

### HOW TO BOOK
- **Online Booking:** [WEBSITE_URL/BOOKING_PAGE]
- **Phone Booking:** [PHONE_NUMBER]
- **Text Booking:** [TEXT_NUMBER] (if available)
- **Email Booking:** [EMAIL_ADDRESS]

### SCHEDULING OPTIONS
- **Same-Day Service:** [AVAILABLE/NOT_AVAILABLE] with [ADDITIONAL_FEE]
- **Recurring Appointments:** [PREFERRED_SCHEDULING_METHOD]
- **Flexible Timing:** [TIME_WINDOWS_AVAILABLE]
- **Key Holding Service:** [AVAILABLE_FOR_REGULAR_CUSTOMERS]

## POLICIES & PROCEDURES

### SERVICE POLICIES
- **Cancellation Policy:** [CANCELLATION_TIMEFRAME_AND_FEES]
- **Rescheduling:** [RESCHEDULING_POLICY]
- **Access Requirements:** [KEY_OR_ACCESS_REQUIREMENTS]
- **Pet Policy:** [PET_FRIENDLY_POLICY]
- **Satisfaction Guarantee:** [GUARANTEE_DETAILS]

### PAYMENT POLICIES
- **Payment Methods:** Cash, Check, Credit/Debit Cards, Online Payment
- **Payment Timing:** [PAYMENT_DUE_BEFORE/AFTER_SERVICE]
- **Late Payment:** [LATE_PAYMENT_POLICY]
- **Automatic Payment:** [AUTOPAY_OPTIONS]

### INSURANCE & BONDING
- **Liability Insurance:** $[COVERAGE_AMOUNT]
- **Bonding:** $[BONDING_AMOUNT]
- **Workers' Compensation:** [COVERAGE_DETAILS]
- **Background Checks:** [EMPLOYEE_SCREENING_PROCESS]

## CLEANING SUPPLIES & EQUIPMENT

### SUPPLIES PROVIDED
- **Cleaning Products:** [ECO_FRIENDLY/STANDARD] products included
- **Equipment:** [VACUUM_CLEANERS/MOPS/ETC] provided
- **Special Products:** [DISINFECTANTS/SPECIALTY_CLEANERS]

### CLIENT-PROVIDED SUPPLIES
- **Optional:** Clients may request use of their preferred products
- **Special Needs:** [ALLERGY_FRIENDLY/CHEMICAL_FREE_OPTIONS]

## TEAM INFORMATION
- **Team Size:** [NUMBER] professional cleaners
- **Experience:** Average [YEARS] years of cleaning experience
- **Training:** [TRAINING_PROGRAM_DETAILS]
- **Background Checks:** All employees undergo [SCREENING_PROCESS]
- **Uniforms:** [UNIFORM_POLICY]

## FREQUENTLY ASKED QUESTIONS

**Q: Do I need to be home during the cleaning?**
A: [HOME_PRESENCE_POLICY]

**Q: What if I'm not satisfied with the cleaning?**
A: [SATISFACTION_GUARANTEE_PROCESS]

**Q: Do you bring your own supplies?**
A: [SUPPLY_POLICY_DETAILS]

**Q: Are you insured and bonded?**
A: [INSURANCE_AND_BONDING_DETAILS]

**Q: How do I prepare for my first cleaning?**
A: [PREPARATION_INSTRUCTIONS]

**Q: Can you clean around my pets?**
A: [PET_POLICY_DETAILS]

**Q: Do you offer one-time cleanings?**
A: [ONE_TIME_SERVICE_AVAILABILITY]

## CUSTOMER TESTIMONIALS
- *"[TESTIMONIAL_ABOUT_QUALITY]"* - [CUSTOMER_NAME], [LOCATION]
- *"[TESTIMONIAL_ABOUT_RELIABILITY]"* - [CUSTOMER_NAME], [LOCATION]
- *"[TESTIMONIAL_ABOUT_STAFF]"* - [CUSTOMER_NAME], [LOCATION]

## CONTACT INFORMATION
- **Owner/Manager:** [NAME] - [PHONE] - [EMAIL]
- **Scheduling:** [PHONE] - [EMAIL]
- **Billing Questions:** [PHONE] - [EMAIL]
- **Emergency Contact:** [PHONE]

## SERVICE AREA
We proudly serve the following areas:
- [CITY_1] and surrounding areas
- [CITY_2] and surrounding areas
- [CITY_3] and surrounding areas
- **Travel Fee:** [FEE_STRUCTURE] for areas outside [PRIMARY_SERVICE_AREA]`,
      },
    ],
  },
  {
    id: "technology",
    name: "Technology Services",
    icon: <Laptop className="h-4 w-4" />,
    description: "IT services, web development, tech support",
    templates: [
      {
        id: "it-services",
        title: "IT Services & Tech Support",
        description: "Comprehensive template for IT service providers and tech support companies",
        tags: ["IT", "technology", "support", "services"],
        content: `# [COMPANY_NAME] - IT Services & Technology Solutions

## COMPANY INFORMATION
- **Business Name:** [COMPANY_NAME]
- **Service Type:** [Managed IT Services/IT Support/Cybersecurity/Cloud Services]
- **Established:** [YEAR]
- **Service Area:** [GEOGRAPHIC_COVERAGE]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **LinkedIn:** [LINKEDIN_PROFILE]

## BUSINESS HOURS
- **Monday-Friday:** [BUSINESS_HOURS]
- **Saturday:** [WEEKEND_HOURS or "Emergency Only"]
- **Sunday:** [WEEKEND_HOURS or "Emergency Only"]
- **24/7 Emergency Support:** [AVAILABLE/NOT_AVAILABLE]
- **Response Time:** [GUARANTEED_RESPONSE_TIME]

## COMPANY OVERVIEW
[COMPANY_NAME] provides comprehensive IT solutions to [TARGET_MARKET] throughout [SERVICE_AREA]. Since [YEAR], we've been helping businesses [VALUE_PROPOSITION] through reliable technology services and proactive support.

**Our Mission:** [MISSION_STATEMENT]

**Core Values:**
- [VALUE_1 - e.g., Proactive problem prevention]
- [VALUE_2 - e.g., Transparent communication]
- [VALUE_3 - e.g., Cutting-edge solutions]
- [VALUE_4 - e.g., Exceptional customer service]

## SERVICES OFFERED

### MANAGED IT SERVICES
**Complete IT Management:** $[PRICE_RANGE] per user/month
- [SERVICE_COMPONENT_1]
- [SERVICE_COMPONENT_2]
- [SERVICE_COMPONENT_3]
- [SERVICE_COMPONENT_4]

**Includes:**
- 24/7 Network Monitoring
- Help Desk Support
- Software Updates & Patches
- Backup & Disaster Recovery
- Cybersecurity Protection

### CYBERSECURITY SERVICES
**Security Assessment:** $[PRICE_RANGE]
- [ASSESSMENT_COMPONENT_1]
- [ASSESSMENT_COMPONENT_2]
- [ASSESSMENT_COMPONENT_3]

**Ongoing Security Management:** $[PRICE_RANGE] per month
- [SECURITY_SERVICE_1]
- [SECURITY_SERVICE_2]
- [SECURITY_SERVICE_3]

### CLOUD SERVICES
**Cloud Migration:** $[PRICE_RANGE]
- [MIGRATION_SERVICE_1]
- [MIGRATION_SERVICE_2]
- [MIGRATION_SERVICE_3]

**Cloud Management:** $[PRICE_RANGE] per month
- [CLOUD_MANAGEMENT_1]
- [CLOUD_MANAGEMENT_2]
- [CLOUD_MANAGEMENT_3]

### BACKUP & DISASTER RECOVERY
**Backup Solutions:** $[PRICE_RANGE] per month
- [BACKUP_FEATURE_1]
- [BACKUP_FEATURE_2]
- [BACKUP_FEATURE_3]

**Disaster Recovery Planning:** $[PRICE_RANGE]
- [DR_COMPONENT_1]
- [DR_COMPONENT_2]
- [DR_COMPONENT_3]

### NETWORK INFRASTRUCTURE
**Network Design & Installation:** $[PRICE_RANGE]
- [NETWORK_SERVICE_1]
- [NETWORK_SERVICE_2]
- [NETWORK_SERVICE_3]

**Network Maintenance:** $[PRICE_RANGE] per month
- [MAINTENANCE_SERVICE_1]
- [MAINTENANCE_SERVICE_2]

## SUPPORT SERVICES

### HELP DESK SUPPORT
**Unlimited Support:** Included with managed services
- **Phone Support:** [PHONE_NUMBER]
- **Email Support:** [SUPPORT_EMAIL]
- **Remote Support:** [REMOTE_ACCESS_TOOLS]
- **On-Site Support:** [AVAILABILITY_AND_PRICING]

### RESPONSE TIMES
- **Critical Issues:** [TIME_FRAME] response
- **High Priority:** [TIME_FRAME] response
- **Medium Priority:** [TIME_FRAME] response
- **Low Priority:** [TIME_FRAME] response

### SUPPORT CHANNELS
- **Phone:** [PHONE_NUMBER] - [AVAILABILITY]
- **Email:** [SUPPORT_EMAIL] - [RESPONSE_TIME]
- **Online Portal:** [PORTAL_URL] - 24/7 ticket submission
- **Remote Access:** [REMOTE_SUPPORT_AVAILABILITY]

## INDUSTRY SPECIALIZATIONS

### [INDUSTRY_1]
**Specialized Services:**
- [INDUSTRY_SPECIFIC_SERVICE_1]
- [INDUSTRY_SPECIFIC_SERVICE_2]
- [COMPLIANCE_REQUIREMENTS]

### [INDUSTRY_2]
**Specialized Services:**
- [INDUSTRY_SPECIFIC_SERVICE_1]
- [INDUSTRY_SPECIFIC_SERVICE_2]
- [COMPLIANCE_REQUIREMENTS]

## TECHNOLOGY PARTNERSHIPS
We partner with leading technology vendors:
- **[VENDOR_1]:** [PARTNERSHIP_LEVEL] - [SERVICES_PROVIDED]
- **[VENDOR_2]:** [PARTNERSHIP_LEVEL] - [SERVICES_PROVIDED]
- **[VENDOR_3]:** [PARTNERSHIP_LEVEL] - [SERVICES_PROVIDED]

## TEAM & CERTIFICATIONS

### TECHNICAL TEAM
**[TEAM_MEMBER_1] - [TITLE]**
- **Certifications:** [LIST_OF_CERTIFICATIONS]
- **Experience:** [YEARS] years in IT
- **Specializations:** [AREAS_OF_EXPERTISE]

**[TEAM_MEMBER_2] - [TITLE]**
- **Certifications:** [LIST_OF_CERTIFICATIONS]
- **Experience:** [YEARS] years in IT
- **Specializations:** [AREAS_OF_EXPERTISE]

### COMPANY CERTIFICATIONS
- [CERTIFICATION_1]
- [CERTIFICATION_2]
- [CERTIFICATION_3]

## PRICING STRUCTURE

### MANAGED SERVICES PRICING
**Essential Plan:** $[PRICE] per user/month
- [ESSENTIAL_FEATURE_1]
- [ESSENTIAL_FEATURE_2]
- [ESSENTIAL_FEATURE_3]

**Professional Plan:** $[PRICE] per user/month
- [ALL_ESSENTIAL_FEATURES]
- [PROFESSIONAL_FEATURE_1]
- [PROFESSIONAL_FEATURE_2]

**Enterprise Plan:** $[PRICE] per user/month
- [ALL_PROFESSIONAL_FEATURES]
- [ENTERPRISE_FEATURE_1]
- [ENTERPRISE_FEATURE_2]

### PROJECT-BASED PRICING
- **Network Setup:** $[PRICE_RANGE]
- **Server Installation:** $[PRICE_RANGE]
- **Security Audit:** $[PRICE_RANGE]
- **Cloud Migration:** $[PRICE_RANGE]

### HOURLY RATES
- **On-Site Support:** $[RATE] per hour
- **Remote Support:** $[RATE] per hour
- **Emergency Support:** $[RATE] per hour
- **Minimum Billing:** [MINIMUM_HOURS] hours

## SERVICE LEVEL AGREEMENTS (SLA)

### UPTIME GUARANTEES
- **Network Uptime:** [PERCENTAGE]%
- **Server Uptime:** [PERCENTAGE]%
- **Email Uptime:** [PERCENTAGE]%

### RESPONSE TIME COMMITMENTS
- **Critical Issues:** [TIME_COMMITMENT]
- **Non-Critical Issues:** [TIME_COMMITMENT]
- **Scheduled Maintenance:** [ADVANCE_NOTICE_PERIOD]

## FREQUENTLY ASKED QUESTIONS

**Q: What is included in your managed IT services?**
A: [COMPREHENSIVE_LIST_OF_MANAGED_SERVICES]

**Q: How quickly do you respond to support requests?**
A: [DETAILED_RESPONSE_TIME_BREAKDOWN]

**Q: Do you provide 24/7 support?**
A: [24_7_SUPPORT_AVAILABILITY_DETAILS]

**Q: Can you help with compliance requirements?**
A: [COMPLIANCE_SUPPORT_CAPABILITIES]

**Q: What happens if our systems go down?**
A: [EMERGENCY_RESPONSE_PROCEDURE]

**Q: Do you work with small businesses?**
A: [SMALL_BUSINESS_SERVICE_APPROACH]

**Q: How do you ensure data security?**
A: [SECURITY_MEASURES_AND_PROTOCOLS]

## CLIENT SUCCESS STORIES
- *"[TESTIMONIAL_ABOUT_RELIABILITY]"* - [CLIENT_NAME], [COMPANY_TITLE]
- *"[TESTIMONIAL_ABOUT_EXPERTISE]"* - [CLIENT_NAME], [COMPANY_TITLE]
- *"[TESTIMONIAL_ABOUT_SUPPORT]"* - [CLIENT_NAME], [COMPANY_TITLE]

## GETTING STARTED

### CONSULTATION PROCESS
1. **Initial Assessment:** [FREE_CONSULTATION_DETAILS]
2. **Needs Analysis:** [ASSESSMENT_PROCESS]
3. **Proposal Development:** [PROPOSAL_TIMELINE]
4. **Implementation:** [IMPLEMENTATION_PROCESS]
5. **Ongoing Support:** [SUPPORT_TRANSITION]

### ONBOARDING PROCESS
- **Week 1:** [ONBOARDING_STEP_1]
- **Week 2:** [ONBOARDING_STEP_2]
- **Week 3:** [ONBOARDING_STEP_3]
- **Ongoing:** [ONGOING_RELATIONSHIP_MANAGEMENT]

## CONTACT INFORMATION
- **General Manager:** [NAME] - [PHONE] - [EMAIL]
- **Technical Director:** [NAME] - [PHONE] - [EMAIL]
- **Sales Inquiries:** [PHONE] - [EMAIL]
- **Support Requests:** [PHONE] - [EMAIL]
- **Emergency Support:** [PHONE] - Available [HOURS]`,
      },
    ],
  },
  {
    id: "creative-services",
    name: "Creative Services",
    icon: <Camera className="h-4 w-4" />,
    description: "Photography, design, marketing, creative agencies",
    templates: [
      {
        id: "photography-studio",
        title: "Photography Studio",
        description: "Perfect for photographers, photo studios, and visual artists",
        tags: ["photography", "creative", "studio", "portraits"],
        content: `# [STUDIO_NAME] - Professional Photography Services

## STUDIO INFORMATION
- **Studio Name:** [STUDIO_NAME]
- **Photography Style:** [PORTRAIT/WEDDING/COMMERCIAL/EVENT/LIFESTYLE]
- **Established:** [YEAR]
- **Studio Location:** [FULL_ADDRESS]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **Social Media:** [@INSTAGRAM] | [FACEBOOK_PAGE] | [@PINTEREST]

## STUDIO HOURS
- **Monday-Friday:** [BUSINESS_HOURS]
- **Saturday:** [WEEKEND_HOURS]
- **Sunday:** [WEEKEND_HOURS or "By Appointment"]
- **Evening Sessions:** [AVAILABLE/BY_REQUEST]
- **Holiday Availability:** [HOLIDAY_BOOKING_POLICY]

## PHOTOGRAPHER PROFILE
**[PHOTOGRAPHER_NAME]** has been capturing [PHOTOGRAPHY_SPECIALTY] for [YEARS] years. [BRIEF_BACKGROUND_AND_PHILOSOPHY].

**Photography Style:** [DESCRIPTION_OF_ARTISTIC_STYLE]
**Approach:** [DESCRIPTION_OF_WORKING_APPROACH_WITH_CLIENTS]

**Education & Training:**
- [PHOTOGRAPHY_EDUCATION]
- [RELEVANT_WORKSHOPS_OR_CERTIFICATIONS]
- [PROFESSIONAL_ASSOCIATIONS]

## PHOTOGRAPHY SERVICES

### PORTRAIT PHOTOGRAPHY
**Individual Portraits:** $[PRICE_RANGE]
- [SESSION_DURATION] session
- [NUMBER] edited high-resolution images
- [ADDITIONAL_INCLUSIONS]

**Family Portraits:** $[PRICE_RANGE]
- [SESSION_DURATION] session
- [NUMBER] edited high-resolution images
- [ADDITIONAL_INCLUSIONS]

**Professional Headshots:** $[PRICE_RANGE]
- [SESSION_DURATION] session
- [NUMBER] edited high-resolution images
- [ADDITIONAL_INCLUSIONS]

### WEDDING PHOTOGRAPHY
**Wedding Package 1:** $[PRICE]
- [COVERAGE_HOURS] hours of coverage
- [NUMBER] edited high-resolution images
- [ADDITIONAL_SERVICES_INCLUDED]

**Wedding Package 2:** $[PRICE]
- [COVERAGE_HOURS] hours of coverage
- [NUMBER] edited high-resolution images
- [ADDITIONAL_SERVICES_INCLUDED]

**Engagement Sessions:** $[PRICE]
- [SESSION_DETAILS]

### EVENT PHOTOGRAPHY
**Corporate Events:** $[HOURLY_RATE] per hour
- [MINIMUM_HOURS] hour minimum
- [DELIVERABLES_INCLUDED]

**Private Events:** $[HOURLY_RATE] per hour
- [MINIMUM_HOURS] hour minimum
- [DELIVERABLES_INCLUDED]

### COMMERCIAL PHOTOGRAPHY
**Product Photography:** $[PRICE_RANGE]
- [NUMBER] products per session
- [EDITING_INCLUDED]
- [USAGE_RIGHTS]

**Business Photography:** $[PRICE_RANGE]
- [SESSION_DETAILS]
- [DELIVERABLES]

## STUDIO FACILITIES
**Main Studio:**
- [STUDIO_SIZE] with [LIGHTING_SETUP]
- [BACKDROP_OPTIONS]
- [PROPS_AVAILABLE]

**Equipment:**
- [CAMERA_EQUIPMENT]
- [LIGHTING_EQUIPMENT]
- [SPECIALIZED_EQUIPMENT]

**Amenities:**
- [CLIENT_AMENITIES]
- [CHANGING_AREA]
- [REFRESHMENTS]

## BOOKING PROCESS

### CONSULTATION
**Initial Consultation:** [FREE/PAID] - [DURATION]
- Discuss vision and goals
- Review portfolio and style
- Explain process and pricing
- Answer questions

### BOOKING REQUIREMENTS
- **Retainer:** [PERCENTAGE]% to secure date
- **Contract:** Signed photography agreement required
- **Final Payment:** Due [TIMEFRAME] before session
- **Rescheduling:** [RESCHEDULING_POLICY]

### SESSION PREPARATION
**What to Expect:**
- [PRE_SESSION_CONSULTATION_DETAILS]
- [SESSION_DURATION_AND_FLOW]
- [WARDROBE_GUIDANCE]
- [LOCATION_DETAILS]

## PRICING & PACKAGES

### SESSION FEES
All sessions include:
- [INCLUDED_SERVICE_1]
- [INCLUDED_SERVICE_2]
- [INCLUDED_SERVICE_3]
- [INCLUDED_SERVICE_4]

### ADDITIONAL SERVICES
- **Extra Editing:** $[PRICE] per image
- **Rush Delivery:** $[PRICE] for [TIMEFRAME] delivery
- **Additional Hours:** $[HOURLY_RATE]
- **Travel Fee:** $[RATE] for locations beyond [DISTANCE]

### PRINT SERVICES
- **8x10 Prints:** $[PRICE] each
- **11x14 Prints:** $[PRICE] each
- **16x20 Prints:** $[PRICE] each
- **Canvas Prints:** $[PRICE_RANGE]
- **Photo Albums:** $[PRICE_RANGE]

## DELIVERY & TIMELINE

### STANDARD DELIVERY
- **Sneak Peeks:** [TIMEFRAME] after session
- **Full Gallery:** [TIMEFRAME] after session
- **Delivery Method:** [ONLINE_GALLERY/USB/CLOUD_DOWNLOAD]
- **Gallery Access:** [DURATION] of access

### RUSH DELIVERY
- **Available:** [YES/NO] for additional fee
- **Timeline:** [RUSH_TIMEFRAME]
- **Additional Cost:** $[RUSH_FEE]

## POLICIES

### PAYMENT POLICY
- **Accepted Methods:** Cash, Check, Credit Cards, PayPal
- **Payment Schedule:** [RETAINER_AND_FINAL_PAYMENT_SCHEDULE]
- **Late Payment:** [LATE_PAYMENT_POLICY]

### CANCELLATION POLICY
- **Client Cancellation:** [CANCELLATION_TERMS_AND_REFUND_POLICY]
- **Weather Cancellation:** [WEATHER_POLICY_FOR_OUTDOOR_SESSIONS]
- **Photographer Cancellation:** [PHOTOGRAPHER_CANCELLATION_POLICY]

### USAGE RIGHTS
- **Client Rights:** [PERSONAL_USE_RIGHTS]
- **Commercial Use:** [COMMERCIAL_USE_POLICY]
- **Social Media:** [SOCIAL_MEDIA_USAGE_RIGHTS]
- **Photographer Rights:** [PORTFOLIO_AND_MARKETING_USAGE]

## SPECIALTY SERVICES

### [SPECIALTY_1]
**Description:** [DETAILED_DESCRIPTION]
**Pricing:** $[PRICE_RANGE]
**Includes:** [WHAT_IS_INCLUDED]

### [SPECIALTY_2]
**Description:** [DETAILED_DESCRIPTION]
**Pricing:** $[PRICE_RANGE]
**Includes:** [WHAT_IS_INCLUDED]

## FREQUENTLY ASKED QUESTIONS

**Q: How far in advance should I book?**
A: [BOOKING_TIMELINE_RECOMMENDATIONS]

**Q: What should I wear for my session?**
A: [WARDROBE_GUIDANCE_AND_STYLING_TIPS]

**Q: Can we include props or pets?**
A: [PROPS_AND_PETS_POLICY]

**Q: What happens if it rains during our outdoor session?**
A: [WEATHER_CONTINGENCY_PLAN]

**Q: How many photos will I receive?**
A: [PHOTO_DELIVERY_EXPECTATIONS]

**Q: Can I purchase the raw/unedited images?**
A: [RAW_IMAGE_POLICY]

**Q: Do you offer payment plans?**
A: [PAYMENT_PLAN_AVAILABILITY]

## CLIENT TESTIMONIALS
- *"[TESTIMONIAL_ABOUT_QUALITY]"* - [CLIENT_NAME]
- *"[TESTIMONIAL_ABOUT_EXPERIENCE]"* - [CLIENT_NAME]
- *"[TESTIMONIAL_ABOUT_PROFESSIONALISM]"* - [CLIENT_NAME]

## AWARDS & RECOGNITION
- [PHOTOGRAPHY_AWARD_1] - [YEAR]
- [PHOTOGRAPHY_AWARD_2] - [YEAR]
- [PUBLICATION_FEATURE] - [PUBLICATION_NAME]

## CONTACT & BOOKING
- **Photographer:** [PHOTOGRAPHER_NAME] - [PHONE] - [EMAIL]
- **Booking Inquiries:** [BOOKING_EMAIL]
- **General Questions:** [GENERAL_EMAIL]
- **Studio Address:** [FULL_ADDRESS]

## PORTFOLIO
View our complete portfolio at [WEBSITE_URL]
Follow our latest work on Instagram [@INSTAGRAM_HANDLE]`,
      },
    ],
  },
]

