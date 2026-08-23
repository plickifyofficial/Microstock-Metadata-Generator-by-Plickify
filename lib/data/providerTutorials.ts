/**
 * Bilingual (English + Bengali) "How to get the API key" tutorials -
 * same concept as CSV Tree's providerTutorials.js. Each entry is keyed
 * by the provider id from lib/ai/providers.ts.
 */

export interface TutorialStep {
  title: string;
  body: string;
  link?: { label: string; url: string };
}

export interface TutorialLang {
  tagline: string;
  keyHint: string;
  summary: string;
  steps: TutorialStep[];
  notes: string[];
}

export interface ProviderTutorial {
  name: string;
  dashUrl: string;
  docsUrl: string;
  en: TutorialLang;
  bn: TutorialLang;
}

export const PROVIDER_TUTORIALS: Record<string, ProviderTutorial> = {
  groq: {
    name: "Groq",
    dashUrl: "https://console.groq.com/keys",
    docsUrl: "https://console.groq.com/docs",
    en: {
      tagline: "Fastest free option - recommended for beginners",
      keyHint: "Keys start with gsk_",
      summary:
        "Groq gives a generous free tier with a fast Llama vision model. You only need an email address to start - no credit card.",
      steps: [
        {
          title: "Open the Groq console",
          body: "Go to console.groq.com and sign up with Google or email. No credit card needed for the free tier.",
          link: { label: "console.groq.com", url: "https://console.groq.com" },
        },
        {
          title: "Open API Keys",
          body: "In the left sidebar click 'API Keys' (or go directly to console.groq.com/keys).",
        },
        {
          title: "Create a new key",
          body: "Click 'Create API Key', give it a name like 'metadata generator', and press Submit.",
        },
        {
          title: "Copy the key immediately",
          body: "The key starts with gsk_ and is shown only once. Copy it right away.",
        },
        {
          title: "Paste it here",
          body: "Come back to the API Keys modal, select Groq, paste the key and press Add.",
        },
      ],
      notes: [
        "Free tier: ~30 requests per minute, 14,400 requests/day.",
        "If you hit daily limits, add another provider as automatic fallback.",
      ],
    },
    bn: {
      tagline: "সবচেয়ে দ্রুত ফ্রি অপশন - নতুনদের জন্য প্রথম পছন্দ",
      keyHint: "Key শুরু হয় gsk_ দিয়ে",
      summary:
        "Groq-এর ফ্রি টিয়ার খুবই ভালো - দ্রুত Llama vision model সহ। শুধু email দিয়েই account খুলতে পারবেন, credit card লাগে না।",
      steps: [
        {
          title: "Groq console খুলুন",
          body: "console.groq.com-এ যান এবং Google বা email দিয়ে sign up করুন। ফ্রি টিয়ারের জন্য credit card লাগে না।",
          link: { label: "console.groq.com", url: "https://console.groq.com" },
        },
        {
          title: "API Keys-এ যান",
          body: "বাম sidebar থেকে 'API Keys' ক্লিক করুন (অথবা সরাসরি console.groq.com/keys-এ যান)।",
        },
        {
          title: "নতুন key তৈরি করুন",
          body: "'Create API Key' ক্লিক করুন, নাম দিন যেমন 'metadata generator', তারপর Submit চাপুন।",
        },
        {
          title: "সাথে সাথে key copy করুন",
          body: "Key টি gsk_ দিয়ে শুরু হয় এবং শুধু একবার দেখানো হয়। সাথে সাথে copy করে রাখুন।",
        },
        {
          title: "এখানে paste করুন",
          body: "API Keys modal-এ ফিরে এসে Groq সিলেক্ট করুন, key paste করে Add চাপুন।",
        },
      ],
      notes: [
        "ফ্রি টিয়ার: প্রতি মিনিটে ~30 request, দিনে 14,400 request।",
        "Daily limit শেষ হলে অন্য একটি provider fallback হিসেবে যোগ করুন।",
      ],
    },
  },

  gemini: {
    name: "Google Gemini",
    dashUrl: "https://aistudio.google.com/app/apikey",
    docsUrl: "https://ai.google.dev/docs",
    en: {
      tagline: "Google's multimodal model with a solid free tier",
      keyHint: "Keys start with AIza",
      summary:
        "Gemini has strong image understanding. Free tier is limited per minute but resets daily - great as a second provider.",
      steps: [
        {
          title: "Open Google AI Studio",
          body: "Go to aistudio.google.com and sign in with your Google account.",
          link: { label: "aistudio.google.com", url: "https://aistudio.google.com" },
        },
        {
          title: "Open Get API key",
          body: "Click 'Get API key' in the left menu, then 'Create API key'.",
        },
        {
          title: "Create in a project",
          body: "Pick an existing Google Cloud project or let it create a new one for you.",
        },
        {
          title: "Copy the key",
          body: "The key starts with AIza. Copy it - you can view it again later from the same page.",
        },
        {
          title: "Paste it here",
          body: "Select Gemini in this modal, paste, and press Add.",
        },
      ],
      notes: [
        "Free flash models: about 10 requests per minute.",
        "If one Gemini model is busy, the app automatically retries alternate Gemini models.",
      ],
    },
    bn: {
      tagline: "Google-এর শক্তিশালী multimodal model, ভালো ফ্রি টিয়ার",
      keyHint: "Key শুরু হয় AIza দিয়ে",
      summary:
        "Gemini image understanding-এ খুব ভালো। ফ্রি টিয়ার প্রতি মিনিটে সীমিত কিন্তু প্রতিদিন reset হয় - দ্বিতীয় provider হিসেবে দারুণ।",
      steps: [
        {
          title: "Google AI Studio খুলুন",
          body: "aistudio.google.com-এ যান এবং আপনার Google account দিয়ে sign in করুন।",
          link: { label: "aistudio.google.com", url: "https://aistudio.google.com" },
        },
        {
          title: "Get API key খুলুন",
          body: "বাম মেনু থেকে 'Get API key' ক্লিক করুন, তারপর 'Create API key'।",
        },
        {
          title: "Project-এ তৈরি করুন",
          body: "কোনো existing Google Cloud project বেছে নিন বা নতুন project তৈরি হতে দিন।",
        },
        {
          title: "Key copy করুন",
          body: "Key টি AIza দিয়ে শুরু হয়। Copy করুন - পরে একই পেজ থেকে আবার দেখা যায়।",
        },
        {
          title: "এখানে paste করুন",
          body: "এই modal-এ Gemini সিলেক্ট করুন, paste করে Add চাপুন।",
        },
      ],
      notes: [
        "ফ্রি flash model: প্রতি মিনিটে প্রায় 10 request।",
        "একটি Gemini model ব্যস্ত থাকলে app নিজে থেকেই বিকল্প Gemini model চেষ্টা করে।",
      ],
    },
  },

  openai: {
    name: "OpenAI",
    dashUrl: "https://platform.openai.com/api-keys",
    docsUrl: "https://platform.openai.com/docs",
    en: {
      tagline: "GPT-4o Mini vision - highest accuracy, paid",
      keyHint: "Keys start with sk-",
      summary:
        "Best quality results, but OpenAI requires a paid balance. Add billing first, then create the key.",
      steps: [
        {
          title: "Open the OpenAI platform",
          body: "Go to platform.openai.com and sign in / sign up.",
          link: { label: "platform.openai.com", url: "https://platform.openai.com" },
        },
        {
          title: "Add billing",
          body: "Open Settings > Billing and add a payment method plus a small credit (e.g. $5). Vision calls cost fractions of a cent.",
        },
        {
          title: "Create the key",
          body: "Go to API Keys > 'Create new secret key'. Name it and create.",
        },
        {
          title: "Copy immediately",
          body: "The sk-... key is shown only once - copy it now.",
        },
        {
          title: "Paste it here",
          body: "Select OpenAI, paste, press Add.",
        },
      ],
      notes: [
        "Paid only - keep a small balance.",
        "GPT-4o Mini is very cheap for metadata work (~$0.15 per 1000 images).",
      ],
    },
    bn: {
      tagline: "GPT-4o Mini vision - সর্বোচ্চ accuracy, paid",
      keyHint: "Key শুরু হয় sk- দিয়ে",
      summary:
        "সবচেয়ে ভালো quality, তবে OpenAI-তে paid balance লাগবে। আগে billing যোগ করুন, তারপর key তৈরি করুন।",
      steps: [
        {
          title: "OpenAI platform খুলুন",
          body: "platform.openai.com-এ যান, sign in/sign up করুন।",
          link: { label: "platform.openai.com", url: "https://platform.openai.com" },
        },
        {
          title: "Billing যোগ করুন",
          body: "Settings > Billing-এ গিয়ে payment method ও সামান্য credit যোগ করুন ($5 যথেষ্ট)। Vision call-এর খরচ খুবই কম।",
        },
        {
          title: "Key তৈরি করুন",
          body: "API Keys > 'Create new secret key'। নাম দিয়ে create করুন।",
        },
        {
          title: "সাথে সাথে copy করুন",
          body: "sk-... key শুধু একবার দেখানো হয় - এখনই copy করুন।",
        },
        {
          title: "এখানে paste করুন",
          body: "OpenAI সিলেক্ট করে paste করুন, Add চাপুন।",
        },
      ],
      notes: [
        "শুধু paid - ছোট balance রাখুন।",
        "Metadata কাজে GPT-4o Mini খুবই সস্তা (~$0.15 প্রতি ১০০০ image-এ)।",
      ],
    },
  },

  openrouter: {
    name: "OpenRouter",
    dashUrl: "https://openrouter.ai/keys",
    docsUrl: "https://openrouter.ai/docs",
    en: {
      tagline: "One key, hundreds of models - free options included",
      keyHint: "Keys start with sk-or-",
      summary:
        "OpenRouter aggregates many providers behind one key. Free vision models are available with daily limits.",
      steps: [
        {
          title: "Sign up at openrouter.ai",
          body: "Create an account with Google or email.",
          link: { label: "openrouter.ai", url: "https://openrouter.ai" },
        },
        {
          title: "Open Keys page",
          body: "Go to openrouter.ai/keys.",
        },
        {
          title: "Create a key",
          body: "Click 'Create Key', name it, and set any spending limit you like.",
        },
        {
          title: "Copy and paste",
          body: "Copy the sk-or-... key, select OpenRouter here, paste and Add.",
        },
      ],
      notes: [
        "Free models have a 50 requests/day limit (20/min).",
        "Adding $10 credit unlocks higher daily limits.",
      ],
    },
    bn: {
      tagline: "একটি key-তে শত শত model - ফ্রি অপশনও আছে",
      keyHint: "Key শুরু হয় sk-or- দিয়ে",
      summary:
        "OpenRouter অনেক provider-কে এক key-র পেছনে যুক্ত করে। Daily limit সহ ফ্রি vision model পাওয়া যায়।",
      steps: [
        {
          title: "openrouter.ai-তে sign up করুন",
          body: "Google বা email দিয়ে account খুলুন।",
          link: { label: "openrouter.ai", url: "https://openrouter.ai" },
        },
        {
          title: "Keys page খুলুন",
          body: "openrouter.ai/keys-এ যান।",
        },
        {
          title: "Key তৈরি করুন",
          body: "'Create Key' ক্লিক করুন, নাম দিন, চাইলে spending limit দিন।",
        },
        {
          title: "Copy করে paste করুন",
          body: "sk-or-... key copy করে এখানে OpenRouter সিলেক্ট করে paste করুন, Add চাপুন।",
        },
      ],
      notes: [
        "ফ্রি model: দিনে 50 request (মিনিটে 20)।",
        "$10 credit যোগ করলে higher daily limit পাওয়া যায়।",
      ],
    },
  },

  mistral: {
    name: "Mistral AI",
    dashUrl: "https://console.mistral.ai/api-keys/",
    docsUrl: "https://docs.mistral.ai",
    en: {
      tagline: "Pixtral 12B vision - good backup provider",
      keyHint: "No fixed prefix",
      summary:
        "Mistral's free experiment tier is small but works well as a third or fourth fallback provider.",
      steps: [
        {
          title: "Open Mistral console",
          body: "Go to console.mistral.ai and sign up (phone verification may be required).",
          link: { label: "console.mistral.ai", url: "https://console.mistral.ai" },
        },
        {
          title: "Accept the terms",
          body: "On first login accept the platform conditions.",
        },
        {
          title: "Create API key",
          body: "Open 'API Keys' in the left menu, then 'Create new key'. Copy it right away.",
        },
        {
          title: "Paste it here",
          body: "Select Mistral AI, paste, press Add.",
        },
      ],
      notes: ["Experiment tier: about 10 requests/min with low daily quota."],
    },
    bn: {
      tagline: "Pixtral 12B vision - ভালো backup provider",
      keyHint: "নির্দিষ্ট prefix নেই",
      summary:
        "Mistral-এর ফ্রি experiment টিয়ার ছোট কিন্তু তৃতীয়/চতুর্থ fallback provider হিসেবে ভালো কাজ করে।",
      steps: [
        {
          title: "Mistral console খুলুন",
          body: "console.mistral.ai-তে যান, sign up করুন (phone verification লাগতে পারে)।",
          link: { label: "console.mistral.ai", url: "https://console.mistral.ai" },
        },
        {
          title: "Terms accept করুন",
          body: "প্রথম login-এ platform condition accept করুন।",
        },
        {
          title: "API key তৈরি করুন",
          body: "বাম মেনু থেকে 'API Keys' > 'Create new key'। সাথে সাথে copy করুন।",
        },
        {
          title: "এখানে paste করুন",
          body: "Mistral AI সিলেক্ট করে paste করুন, Add চাপুন।",
        },
      ],
      notes: ["Experiment টিয়ার: প্রতি মিনিটে ~10 request, daily quota কম।"],
    },
  },

  cloudflare: {
    name: "Cloudflare Workers AI",
    dashUrl: "https://dash.cloudflare.com/profile/api-tokens",
    docsUrl: "https://developers.cloudflare.com/workers-ai/",
    en: {
      tagline: "Llama 4 Vision on Cloudflare edge - huge free quota",
      keyHint: "ACCOUNT_ID:API_TOKEN (one colon, no spaces)",
      summary:
        "Setup has two parts: your static Account ID and an API Token you create. Paste both separated by a single colon.",
      steps: [
        {
          title: "Create a free Cloudflare account",
          body: "Sign up at dash.cloudflare.com - no credit card needed.",
          link: { label: "dash.cloudflare.com", url: "https://dash.cloudflare.com/sign-up" },
        },
        {
          title: "Verify your email",
          body: "Token creation is blocked until you confirm the verification email.",
        },
        {
          title: "Copy your Account ID",
          body: "On the dashboard home, find the 'Account ID' in the right-hand API section (32-character hex). Copy and save it.",
        },
        {
          title: "Create an API token",
          body: "Go to profile/api-tokens > Create Token > Create Custom Token. Name it anything.",
        },
        {
          title: "Add Workers AI permission",
          body: "Permissions: Account > Workers AI > Read. Nothing else is needed. Then Continue to summary and Create Token.",
        },
        {
          title: "Combine both values",
          body: "Paste here as ACCOUNT_ID:API_TOKEN - single colon between them, no spaces.",
        },
      ],
      notes: [
        "Free tier: ~10,000 neurons/day (roughly 2,000 vision generations).",
        "If you regenerate the token, re-paste the full ACCOUNT_ID:NEW_TOKEN combo.",
      ],
    },
    bn: {
      tagline: "Cloudflare edge-এ Llama 4 Vision - বড় ফ্রি quota",
      keyHint: "ACCOUNT_ID:API_TOKEN (একটি colon, space ছাড়া)",
      summary:
        "দুটি অংশ লাগবে: আপনার Account ID (static) এবং নিজে তৈরি করা API Token। দুটোই একটি colon দিয়ে যুক্ত করে paste করবেন।",
      steps: [
        {
          title: "ফ্রি Cloudflare account খুলুন",
          body: "dash.cloudflare.com-এ sign up করুন - credit card লাগে না।",
          link: { label: "dash.cloudflare.com", url: "https://dash.cloudflare.com/sign-up" },
        },
        {
          title: "Email verify করুন",
          body: "Verification email confirm না করলে token তৈরি করা যাবে না।",
        },
        {
          title: "Account ID copy করুন",
          body: "Dashboard home-এর ডান পাশে 'API' section-এ 'Account ID' পাবেন (32-character hex)। Copy করে রাখুন।",
        },
        {
          title: "API token তৈরি করুন",
          body: "profile/api-tokens > Create Token > Create Custom Token। যেকোনো নাম দিন।",
        },
        {
          title: "Workers AI permission দিন",
          body: "Permissions: Account > Workers AI > Read - এটুকুই যথেষ্ট। তারপর Continue করে Create Token।",
        },
        {
          title: "দুটি value জোড়া লাগান",
          body: "এখানে paste করুন: ACCOUNT_ID:API_TOKEN - মাঝে একটি colon, space ছাড়া।",
        },
      ],
      notes: [
        "ফ্রি টিয়ার: ~10,000 neurons/day (প্রায় 2,000 vision generation)।",
        "Token regenerate করলে নতুন করে পুরো ACCOUNT_ID:NEW_TOKEN paste করুন।",
      ],
    },
  },

  nvidia: {
    name: "NVIDIA NIM",
    dashUrl: "https://build.nvidia.com/explore/discover",
    docsUrl: "https://docs.api.nvidia.com",
    en: {
      tagline: "Llama 3.2 90B Vision - generous free tier",
      keyHint: "Keys start with nvapi-",
      summary:
        "NVIDIA hosts large vision models for free with good rate limits - excellent fallback.",
      steps: [
        {
          title: "Open build.nvidia.com",
          body: "Sign up / log in with your NVIDIA or email account.",
          link: { label: "build.nvidia.com", url: "https://build.nvidia.com" },
        },
        {
          title: "Pick a vision model",
          body: "Find Llama 3.2 90B Vision and open its page.",
        },
        {
          title: "Get your key",
          body: "Press 'Get API Key' (or go to org profile > Setup > Generate personal key).",
        },
        {
          title: "Paste it here",
          body: "Copy the nvapi-... key, select NVIDIA NIM, paste and Add.",
        },
      ],
      notes: ["About 40 requests/min free with a healthy daily allowance."],
    },
    bn: {
      tagline: "Llama 3.2 90B Vision - বড় ফ্রি টিয়ার",
      keyHint: "Key শুরু হয় nvapi- দিয়ে",
      summary:
        "NVIDIA বড় vision model ফ্রি দেয়, rate limit-ও ভালো - চমৎকার fallback।",
      steps: [
        {
          title: "build.nvidia.com খুলুন",
          body: "NVIDIA বা email account দিয়ে sign up/log in করুন।",
          link: { label: "build.nvidia.com", url: "https://build.nvidia.com" },
        },
        {
          title: "Vision model বেছে নিন",
          body: "Llama 3.2 90B Vision খুঁজে তার page খুলুন।",
        },
        {
          title: "Key নিন",
          body: "'Get API Key' চাপুন (বা org profile > Setup > Generate personal key)।",
        },
        {
          title: "এখানে paste করুন",
          body: "nvapi-... key copy করে NVIDIA NIM সিলেক্ট করে paste করুন, Add চাপুন।",
        },
      ],
      notes: ["ফ্রিতে প্রায় 40 requests/min, daily allowance-ও ভালো।"],
    },
  },

  github: {
    name: "GitHub Models",
    dashUrl: "https://github.com/settings/personal-access-tokens",
    docsUrl: "https://docs.github.com/en/github-models",
    en: {
      tagline: "Free GPT-4o vision via your GitHub PAT",
      keyHint: "Keys start with github_pat_ or ghp_",
      summary:
        "GitHub gives free access to hosted models including GPT-4o using a Personal Access Token.",
      steps: [
        {
          title: "Open GitHub settings",
          body: "On GitHub go to Settings > Developer settings > Personal access tokens > Fine-grained tokens.",
          link: { label: "github.com/settings", url: "https://github.com/settings/personal-access-tokens" },
        },
        {
          title: "Generate a token",
          body: "Click 'Generate new token'. Models access needs no repo permissions - leave scopes empty.",
        },
        {
          title: "Enable models permission",
          body: "Under 'Account permissions' set 'Models' to Read-only.",
        },
        {
          title: "Paste it here",
          body: "Copy the token, select GitHub Models, paste and Add.",
        },
      ],
      notes: ["Low daily count (~50-150/day) but real GPT-4o quality, free."],
    },
    bn: {
      tagline: "GitHub PAT দিয়ে ফ্রি GPT-4o vision",
      keyHint: "Key শুরু হয় github_pat_ বা ghp_ দিয়ে",
      summary:
        "Personal Access Token দিয়ে GitHub ফ্রিতে GPT-4o-সহ hosted model access দেয়।",
      steps: [
        {
          title: "GitHub settings খুলুন",
          body: "GitHub-এ Settings > Developer settings > Personal access tokens > Fine-grained tokens-এ যান।",
          link: { label: "github.com/settings", url: "https://github.com/settings/personal-access-tokens" },
        },
        {
          title: "Token generate করুন",
          body: "'Generate new token' চাপুন। Model access-এ repo permission লাগে না - scope খালি রাখুন।",
        },
        {
          title: "Models permission দিন",
          body: "'Account permissions'-এ গিয়ে 'Models' = Read-only করুন।",
        },
        {
          title: "এখানে paste করুন",
          body: "Token copy করে GitHub Models সিলেক্ট করে paste করুন, Add চাপুন।",
        },
      ],
      notes: ["Daily count কম (~৫০-১৫০/day) কিন্তু আসল GPT-4o quality, ফ্রি।"],
    },
  },

  cohere: {
    name: "Cohere",
    dashUrl: "https://dashboard.cohere.com/api-keys",
    docsUrl: "https://docs.cohere.com",
    en: {
      tagline: "Command-A Vision - permanent free tier",
      keyHint: "No fixed prefix",
      summary:
        "Cohere's trial keys never expire - 1,000 calls/month free forever. Great occasional-use provider.",
      steps: [
        {
          title: "Open dashboard.cohere.com",
          body: "Sign up with Google or email.",
          link: { label: "dashboard.cohere.com", url: "https://dashboard.cohere.com" },
        },
        {
          title: "Go to API Keys",
          body: "Left menu > API Keys. A default trial key already exists!",
        },
        {
          title: "Copy the trial key",
          body: "You can use the pre-made key or create a new one. Copy it.",
        },
        {
          title: "Paste it here",
          body: "Select Cohere, paste, press Add.",
        },
      ],
      notes: ["Trial keys: 1,000 calls/month, no expiry. Paid keys get higher limits."],
    },
    bn: {
      tagline: "Command-A Vision - স্থায়ী ফ্রি টিয়ার",
      keyHint: "নির্দিষ্ট prefix নেই",
      summary:
        "Cohere-এর trial key কখনো expire হয় না - সারাজীবনে ফ্রি মাসে 1,000 call। মাঝে মাঝে ব্যবহারের জন্য চমৎকার।",
      steps: [
        {
          title: "dashboard.cohere.com খুলুন",
          body: "Google বা email দিয়ে sign up করুন।",
          link: { label: "dashboard.cohere.com", url: "https://dashboard.cohere.com" },
        },
        {
          title: "API Keys-এ যান",
          body: "বাম মেনু > API Keys। একটি default trial key আগেই থাকে!",
        },
        {
          title: "Trial key copy করুন",
          body: "Ready-made key ব্যবহার করতে পারেন বা নতুন বানাতে পারেন। Copy করুন।",
        },
        {
          title: "এখানে paste করুন",
          body: "Cohere সিলেক্ট করে paste করুন, Add চাপুন।",
        },
      ],
      notes: ["Trial key: মাসে 1,000 call, কোনো expiry নেই।"],
    },
  },

  together: {
    name: "Together AI",
    dashUrl: "https://api.together.xyz/settings/api-keys",
    docsUrl: "https://docs.together.ai",
    en: {
      tagline: "Llama vision free endpoint",
      keyHint: "No fixed prefix",
      summary:
        "Together offers a free vision endpoint with modest limits; paid plans scale easily.",
      steps: [
        {
          title: "Sign up at api.together.xyz",
          body: "Create your account with Google or email.",
          link: { label: "api.together.xyz", url: "https://api.together.xyz" },
        },
        {
          title: "Open Settings > API keys",
          body: "In the left sidebar open Settings, then API keys.",
        },
        {
          title: "Create and copy",
          body: "Click 'Create API Key', then copy it.",
        },
        {
          title: "Paste it here",
          body: "Select Together AI, paste, press Add.",
        },
      ],
      notes: ["Free endpoint: about 6 requests/min with a small daily cap."],
    },
    bn: {
      tagline: "Llama vision ফ্রি endpoint",
      keyHint: "নির্দিষ্ট prefix নেই",
      summary:
        "Together মাঝারি limit সহ ফ্রি vision endpoint দেয়; paid plan-এ সহজে scale করা যায়।",
      steps: [
        {
          title: "api.together.xyz-এ sign up করুন",
          body: "Google বা email দিয়ে account খুলুন।",
          link: { label: "api.together.xyz", url: "https://api.together.xyz" },
        },
        {
          title: "Settings > API keys খুলুন",
          body: "বাম sidebar থেকে Settings, তারপর API keys।",
        },
        {
          title: "Create করে copy করুন",
          body: "'Create API Key' ক্লিক করে copy করুন।",
        },
        {
          title: "এখানে paste করুন",
          body: "Together AI সিলেক্ট করে paste করুন, Add চাপুন।",
        },
      ],
      notes: ["ফ্রি endpoint: প্রতি মিনিটে ~6 request, daily cap ছোট।"],
    },
  },

  sambanova: {
    name: "SambaNova Cloud",
    dashUrl: "https://cloud.sambanova.ai/apis",
    docsUrl: "https://docs.sambanova.ai",
    en: {
      tagline: "Fastest Llama 3.2 90B Vision on RDU hardware",
      keyHint: "No fixed prefix",
      summary:
        "SambaNova's free tier runs the big 90B vision model quickly - solid backup.",
      steps: [
        {
          title: "Open cloud.sambanova.ai",
          body: "Sign up with your email.",
          link: { label: "cloud.sambanova.ai", url: "https://cloud.sambanova.ai" },
        },
        {
          title: "Open the API section",
          body: "Go to 'API' in the left menu.",
        },
        {
          title: "Create a key",
          body: "Click 'Create API key' (or use the ready one) and copy it.",
        },
        {
          title: "Paste it here",
          body: "Select SambaNova Cloud, paste, press Add.",
        },
      ],
      notes: ["Free tier: about 10 requests/min with a daily cap."],
    },
    bn: {
      tagline: "RDU hardware-এ সবচেয়ে দ্রুত Llama 3.2 90B Vision",
      keyHint: "নির্দিষ্ট prefix নেই",
      summary:
        "SambaNova-র ফ্রি টিয়ারে বড় 90B vision model দ্রুত চলে - ভরসাযোগ্য backup।",
      steps: [
        {
          title: "cloud.sambanova.ai খুলুন",
          body: "Email দিয়ে sign up করুন।",
          link: { label: "cloud.sambanova.ai", url: "https://cloud.sambanova.ai" },
        },
        {
          title: "API section খুলুন",
          body: "বাম মেনু থেকে 'API'-তে যান।",
        },
        {
          title: "Key তৈরি করুন",
          body: "'Create API key' চাপুন (বা ready key ব্যবহার করুন) এবং copy করুন।",
        },
        {
          title: "এখানে paste করুন",
          body: "SambaNova Cloud সিলেক্ট করে paste করুন, Add চাপুন।",
        },
      ],
      notes: ["ফ্রি টিয়ার: প্রতি মিনিটে ~10 request, daily cap আছে।"],
    },
  },

  deepinfra: {
    name: "DeepInfra",
    dashUrl: "https://deepinfra.com/dash/api_keys",
    docsUrl: "https://deepinfra.com/docs",
    en: {
      tagline: "OpenAI-compatible vision, pay-per-token after credits",
      keyHint: "No fixed prefix",
      summary:
        "Comes with a small starter credit (~$1) that covers thousands of metadata generations.",
      steps: [
        {
          title: "Sign up at deepinfra.com",
          body: "Use Google or email.",
          link: { label: "deepinfra.com", url: "https://deepinfra.com" },
        },
        {
          title: "Open API Keys",
          body: "Go to deepinfra.com/dash/api_keys.",
        },
        {
          title: "Create a key",
          body: "Click 'New API Token' and copy it.",
        },
        {
          title: "Paste it here",
          body: "Select DeepInfra, paste, press Add.",
        },
      ],
      notes: ["~$1 starter credit = thousands of images. Top up anytime."],
    },
    bn: {
      tagline: "OpenAI-compatible vision, starter credit-এর পরে pay-per-token",
      keyHint: "নির্দিষ্ট prefix নেই",
      summary:
        "ছোট starter credit (~$1) সহ আসে - হাজার হাজার metadata generation চলবে।",
      steps: [
        {
          title: "deepinfra.com-এ sign up করুন",
          body: "Google বা email ব্যবহার করুন।",
          link: { label: "deepinfra.com", url: "https://deepinfra.com" },
        },
        {
          title: "API Keys খুলুন",
          body: "deepinfra.com/dash/api_keys-এ যান।",
        },
        {
          title: "Key তৈরি করুন",
          body: "'New API Token' ক্লিক করে copy করুন।",
        },
        {
          title: "এখানে paste করুন",
          body: "DeepInfra সিলেক্ট করে paste করুন, Add চাপুন।",
        },
      ],
      notes: ["~$1 starter credit = হাজারখানেক image। যখন চাই recharge করুন।"],
    },
  },

  cerebras: {
    name: "Cerebras",
    dashUrl: "https://cloud.cerebras.ai",
    docsUrl: "https://inference-docs.cerebras.ai",
    en: {
      tagline: "Text-only speed demon - last-resort fallback",
      keyHint: "Keys start with csk-",
      summary:
        "Cerebras is text-only: it can write metadata if you describe the image, so the app uses it only when every vision provider fails.",
      steps: [
        {
          title: "Open cloud.cerebras.ai",
          body: "Sign up with email - free instantly.",
          link: { label: "cloud.cerebras.ai", url: "https://cloud.cerebras.ai" },
        },
        {
          title: "Create API key",
          body: "Go to API Keys and generate one.",
        },
        {
          title: "Copy and paste",
          body: "Copy the csk-... key, select Cerebras, paste and Add.",
        },
      ],
      notes: [
        "1M tokens/day free.",
        "Text-only: used automatically as the last resort in the fallback chain.",
      ],
    },
    bn: {
      tagline: "Text-only স্পিড চ্যাম্পিয়ন - শেষ ভরসা fallback",
      keyHint: "Key শুরু হয় csk- দিয়ে",
      summary:
        "Cerebras text-only: image বর্ণনা করলে metadata লিখতে পারে, তাই app সব vision provider fail করলেই শুধু এটি ব্যবহার করে।",
      steps: [
        {
          title: "cloud.cerebras.ai খুলুন",
          body: "Email দিয়ে sign up করুন - সাথে সাথেই ফ্রি।",
          link: { label: "cloud.cerebras.ai", url: "https://cloud.cerebras.ai" },
        },
        {
          title: "API key তৈরি করুন",
          body: "API Keys-এ গিয়ে generate করুন।",
        },
        {
          title: "Copy করে paste করুন",
          body: "csk-... key copy করে Cerebras সিলেক্ট করে paste করুন, Add চাপুন।",
        },
      ],
      notes: [
        "দিনে 1M tokens ফ্রি।",
        "Text-only: fallback chain-এর একদম শেষে ব্যবহার হয়।",
      ],
    },
  },
};
