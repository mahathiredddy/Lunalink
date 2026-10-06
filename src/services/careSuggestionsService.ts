/**
 * Care Suggestions Service for LunaLink
 * 
 * Generates personalized, general support suggestions based on the user's
 * selected preferences and available information.
 * 
 * CORE PRINCIPLES:
 * 1. The AI primarily aids with: Explanation, Personalization, Wording, Support suggestions.
 * 2. SAFETY-CRITICAL decisions and permissions remain strictly rule-based.
 * 3. Never exposes raw intimate health data (cycle days, pain scales, symptoms) to the partner.
 * 4. Partner view displays ONLY information explicitly permitted by the user.
 * 5. Mandatory disclaimer: "Suggestions are personalized guidance, not medical advice."
 */

import {
  CareProfile,
  HealthSharingPermissions,
  CareModeState,
  CareSuggestion,
  AIWordingTone,
} from '../types';

export const careSuggestionsService = {
  /**
   * Generates tailored care suggestions based on user Care Profile, active Care Mode,
   * and rule-based privacy permissions.
   */
  generateSuggestions(
    careProfile: CareProfile,
    healthPermissions: HealthSharingPermissions,
    careMode: CareModeState,
    tone: AIWordingTone = 'gentle'
  ): CareSuggestion[] {
    const suggestions: CareSuggestion[] = [];

    // Rule-based check: Is Care Profile permitted to be shared with partner?
    const isCareProfilePermitted = Boolean(healthPermissions.careProfile);

    // 1. Communication Preference: "A quiet check-in"
    const commPref = careProfile.communication && careProfile.communication.length > 0
      ? careProfile.communication[0]
      : 'Text me';

    let quietCheckInDesc = 'A low-pressure text message lets her know you are thinking of her without demanding energy.';
    let quietCheckInAction = 'Send a brief, sweet note letting her know you are there if she needs anything.';
    let sampleText = "Thinking of you! No need to reply, just hope you're having a comfortable afternoon 🤍";

    if (tone === 'practical') {
      quietCheckInDesc = 'Send a single text message. Do not require a response or schedule a call.';
      quietCheckInAction = 'Keep check-ins concise and async (text message or note).';
      sampleText = "Checking in on you. No reply necessary—let me know if you need anything from the kitchen!";
    } else if (tone === 'warm') {
      quietCheckInDesc = 'A gentle, caring message wrapped in warmth reminds her she is loved and supported.';
      quietCheckInAction = 'Send a loving reminder that she can take all the time and rest she needs.';
      sampleText = "Sending you the biggest hug today. Rest as much as you need, I'm right here whenever you want company.";
    } else if (tone === 'minimal') {
      quietCheckInDesc = 'One brief message. Zero response pressure.';
      quietCheckInAction = 'Single text check-in.';
      sampleText = "Thinking of you. Take it easy!";
    }

    suggestions.push({
      id: 'sugg_quiet_checkin',
      title: 'A quiet check-in',
      description: quietCheckInDesc,
      category: 'communication',
      whyThisSuggestion: `Based on her Care Profile preference for "${commPref}". A quiet message provides emotional connection without social exertion.`,
      ruleBasedPermissionRequired: 'careProfile',
      isPermitted: isCareProfilePermitted,
      partnerActionItem: quietCheckInAction,
      sampleMessage: sampleText,
      sourceFactor: `Care Profile: Communication (${commPref})`,
    });

    // 2. Comfort Item: "Her preferred comfort item"
    const topComfort = careProfile.comfort && careProfile.comfort.length > 0
      ? careProfile.comfort[0]
      : (careProfile.otherComfortDetail || 'Warm drink');
    const secondComfort = careProfile.comfort && careProfile.comfort.length > 1
      ? careProfile.comfort[1]
      : 'Rest';

    let comfortDesc = `Offer or prepare her preferred comfort item (${topComfort}) quietly without making a fuss.`;
    let comfortAction = `Check if she would like ${topComfort.toLowerCase()} or fresh water placed nearby.`;

    if (tone === 'practical') {
      comfortDesc = `Prepare ${topComfort} and place it within easy reach.`;
      comfortAction = `Provide ${topComfort} without asking long questions.`;
    } else if (tone === 'warm') {
      comfortDesc = `Surprise her by softly setting up ${topComfort} or cozy blankets to create a soothing space.`;
      comfortAction = `Bring her ${topComfort.toLowerCase()} with a kind smile.`;
    } else if (tone === 'minimal') {
      comfortDesc = `Provide ${topComfort}.`;
      comfortAction = `Set up ${topComfort} nearby.`;
    }

    suggestions.push({
      id: 'sugg_comfort_item',
      title: 'Her preferred comfort item',
      description: comfortDesc,
      category: 'comfort',
      whyThisSuggestion: `Based on her saved Care Profile comfort essentials: she specifically noted "${topComfort}" and "${secondComfort}" help her feel nurtured.`,
      ruleBasedPermissionRequired: 'careProfile',
      isPermitted: isCareProfilePermitted,
      partnerActionItem: comfortAction,
      sampleMessage: `Can I bring you some ${topComfort.toLowerCase()} or refresh your water?`,
      sourceFactor: `Care Profile: Comfort (${topComfort})`,
    });

    // 3. Space & Physical Support: "Giving her space after checking in"
    const physicalPref = careProfile.physicalSupport && careProfile.physicalSupport.length > 0
      ? careProfile.physicalSupport[0]
      : 'Stay nearby';

    let spaceDesc = 'After offering support, allow her time to rest quietly without hovering or waiting for acknowledgment.';
    let spaceAction = 'Step out of the room or give her physical room once her immediate comfort is met.';

    if (tone === 'practical') {
      spaceDesc = 'Deliver comfort and immediately give her quiet time.';
      spaceAction = 'Do not linger or ask for conversation unless she initiates.';
    } else if (tone === 'warm') {
      spaceDesc = 'Giving gentle breathing room is an act of deep love and consideration.';
      spaceAction = 'Let her know you are in the other room whenever she wants you, then give her space.';
    } else if (tone === 'minimal') {
      spaceDesc = 'Check in, then step back.';
      spaceAction = 'Allow quiet downtime.';
    }

    suggestions.push({
      id: 'sugg_giving_space',
      title: 'Giving her space after checking in',
      description: spaceDesc,
      category: 'space',
      whyThisSuggestion: `Based on her Care Profile physical support preference: "${physicalPref}". Having calm downtime allows the nervous system to relax.`,
      ruleBasedPermissionRequired: 'careProfile',
      isPermitted: isCareProfilePermitted,
      partnerActionItem: spaceAction,
      sampleMessage: "I'll be in the other room if you need anything at all—take all the time you need!",
      sourceFactor: `Care Profile: Physical Support (${physicalPref})`,
    });

    // 4. Timing & Boundaries: "Avoiding repeated calls"
    let avoidCallsDesc = 'Refrain from rapid successive calls or multiple pinging notifications. Wait for her natural reply rhythm.';
    let avoidCallsAction = 'Keep phone volume low and avoid calling repeatedly if she does not pick up immediately.';

    if (tone === 'practical') {
      avoidCallsDesc = 'Do not double-call or text repeatedly if unanswered.';
      avoidCallsAction = 'Send one clear message and wait.';
    } else if (tone === 'warm') {
      avoidCallsDesc = 'Trust that she will reconnect when she feels up to it, honoring her natural recovery pace.';
      avoidCallsAction = 'Respect her quiet hours with complete patience.';
    } else if (tone === 'minimal') {
      avoidCallsDesc = 'No repeated calls or pings.';
      avoidCallsAction = 'Wait for response.';
    }

    suggestions.push({
      id: 'sugg_avoiding_calls',
      title: 'Avoiding repeated calls',
      description: avoidCallsDesc,
      category: 'timing',
      whyThisSuggestion: 'Based on her communication boundaries: repeated notifications increase sensory overwhelm during fatigue or discomfort.',
      ruleBasedPermissionRequired: 'careProfile',
      isPermitted: isCareProfilePermitted,
      partnerActionItem: avoidCallsAction,
      sampleMessage: undefined,
      sourceFactor: 'Care Profile: Boundaries & Timing',
    });

    // 5. If Care Mode is Active: dynamically incorporate immediate live guidance
    if (careMode.isActive) {
      const careModeOptions = careMode.options;
      const isUrgentSpace = careModeOptions.includes('Please give me space');
      const hasNote = Boolean(careMode.note);

      suggestions.unshift({
        id: 'sugg_active_care_mode',
        title: isUrgentSpace ? 'Honoring active Care Mode space' : 'Active Care Mode support',
        description: isUrgentSpace
          ? 'She has currently switched on Care Mode and requested calm personal space.'
          : `Care Mode is active. Focus on: ${careModeOptions.slice(0, 2).join(' & ')}.`,
        category: 'daily_support',
        whyThisSuggestion: `Directly signaled via active Care Mode. Her trusted signal is on right now${hasNote ? ` with a personal note: "${careMode.note}"` : ''}.`,
        ruleBasedPermissionRequired: 'generalSupport',
        isPermitted: true, // Care Mode is a direct intentional user trigger
        partnerActionItem: isUrgentSpace
          ? 'Keep the environment extra quiet and hold off on non-essential conversation.'
          : 'Follow her active Care Mode requests with gentle care.',
        sampleMessage: isUrgentSpace ? undefined : "Saw your Care Mode is on. I'm taking care of everything here—just rest 🤍",
        sourceFactor: 'Care Mode: Active Signal',
      });
    }

    return suggestions;
  },

  /**
   * Filters suggestions strictly according to rule-based partner permissions.
   * SAFETY-CRITICAL: If careProfile permission is false, Care Profile derived
   * items are excluded, returning only permitted general partnership items.
   */
  getPartnerPermittedSuggestions(
    careProfile: CareProfile,
    healthPermissions: HealthSharingPermissions,
    careMode: CareModeState,
    tone: AIWordingTone = 'gentle'
  ): {
    permitted: CareSuggestion[];
    hiddenCount: number;
    hasCareProfilePermission: boolean;
  } {
    const all = this.generateSuggestions(careProfile, healthPermissions, careMode, tone);
    const permitted = all.filter((s) => s.isPermitted);
    const hiddenCount = all.length - permitted.length;

    return {
      permitted,
      hiddenCount,
      hasCareProfilePermission: Boolean(healthPermissions.careProfile),
    };
  },
};
