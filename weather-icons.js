/* Animated Weather SVG Icons for Plain JS / HTML */
const WeatherIcons = {
  Sun: (size = 48) => `
    <svg viewBox="0 0 48 48" fill="none" style="width:${size}px; height:${size}px;">
      <g style="transform-origin:24px 24px; animation: spinSun 12s linear infinite;">
        <line x1="24" y1="6" x2="24" y2="10" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" />
        <line x1="24" y1="38" x2="24" y2="42" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" />
        <line x1="6" y1="24" x2="10" y2="24" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" />
        <line x1="38" y1="24" x2="42" y2="24" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" />
        <line x1="11.27" y1="11.27" x2="14.1" y2="14.1" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" />
        <line x1="33.9" y1="33.9" x2="36.73" y2="36.73" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" />
        <line x1="11.27" y1="36.73" x2="14.1" y2="33.9" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" />
        <line x1="33.9" y1="14.1" x2="36.73" y2="11.27" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" />
      </g>
      <circle cx="24" cy="24" r="8" fill="#FBBF24" opacity="0.25" />
      <circle cx="24" cy="24" r="8" stroke="#FBBF24" stroke-width="2" />
    </svg>`,

  Moon: (size = 48) => `
    <svg viewBox="0 0 48 48" fill="none" style="width:${size}px; height:${size}px;">
      <path d="M28 8a14 14 0 100 28 10 10 0 01 0-28z" fill="#A78BFA" opacity="0.2" />
      <path d="M28 8a14 14 0 100 28 10 10 0 01 0-28z" stroke="#A78BFA" stroke-width="2" stroke-linecap="round" />
      <circle cx="34" cy="10" r="1.2" fill="#A78BFA" style="animation: pulseStar 2s infinite ease-in-out;" />
      <circle cx="38" cy="18" r="1" fill="#A78BFA" style="animation: pulseStar 2s infinite ease-in-out 0.5s;" />
      <circle cx="30" cy="6" r="1" fill="#A78BFA" style="animation: pulseStar 2s infinite ease-in-out 1s;" />
    </svg>`,

  Cloud: (size = 48) => `
    <svg viewBox="0 0 48 48" fill="none" style="width:${size}px; height:${size}px;">
      <g style="animation: floatCloud 5s infinite ease-in-out;">
        <path d="M36 30H14a8 8 0 01-.5-16A10 10 0 0134 16a7 7 0 012 14z" fill="#94A3B8" opacity="0.15" />
        <path d="M36 30H14a8 8 0 01-.5-16A10 10 0 0134 16a7 7 0 012 14z" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </svg>`,

  PartlyCloudy: (size = 48) => `
    <svg viewBox="0 0 48 48" fill="none" style="width:${size}px; height:${size}px;">
      <g style="transform-origin: 16px 16px; animation: spinSun 20s linear infinite;">
        <line x1="16" y1="6" x2="16" y2="9" stroke="#FBBF24" stroke-width="1.8" stroke-linecap="round" />
        <line x1="16" y1="23" x2="16" y2="26" stroke="#FBBF24" stroke-width="1.8" stroke-linecap="round" />
        <line x1="6" y1="16" x2="9" y2="16" stroke="#FBBF24" stroke-width="1.8" stroke-linecap="round" />
        <line x1="23" y1="16" x2="26" y2="16" stroke="#FBBF24" stroke-width="1.8" stroke-linecap="round" />
      </g>
      <circle cx="16" cy="16" r="6" stroke="#FBBF24" stroke-width="1.5" fill="#FBBF24" fill-opacity="0.2" />
      <g style="animation: floatCloud 4s infinite ease-in-out;">
        <path d="M38 34H18a7 7 0 01-.5-14A9 9 0 0136 22a6 6 0 012 12z" fill="#94A3B8" opacity="0.15" />
        <path d="M38 34H18a7 7 0 01-.5-14A9 9 0 0136 22a6 6 0 012 12z" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />
      </g>
    </svg>`,

  Rain: (size = 48) => `
    <svg viewBox="0 0 48 48" fill="none" style="width:${size}px; height:${size}px;">
      <path d="M36 22H14a7 7 0 01-.5-14A9 9 0 0134 10a6 6 0 012 12z" fill="#60A5FA" opacity="0.15" />
      <path d="M36 22H14a7 7 0 01-.5-14A9 9 0 0134 10a6 6 0 012 12z" stroke="#60A5FA" stroke-width="2" stroke-linecap="round" />
      <line x1="16" y1="26" x2="16" y2="30" stroke="#60A5FA" stroke-width="2" stroke-linecap="round" style="animation: rainDrop 0.8s infinite ease-in 0s;" />
      <line x1="22" y1="26" x2="22" y2="30" stroke="#60A5FA" stroke-width="2" stroke-linecap="round" style="animation: rainDrop 0.8s infinite ease-in 0.3s;" />
      <line x1="28" y1="26" x2="28" y2="30" stroke="#60A5FA" stroke-width="2" stroke-linecap="round" style="animation: rainDrop 0.8s infinite ease-in 0.6s;" />
      <line x1="34" y1="26" x2="34" y2="30" stroke="#60A5FA" stroke-width="2" stroke-linecap="round" style="animation: rainDrop 0.8s infinite ease-in 0.15s;" />
    </svg>`,

  HeavyRain: (size = 48) => `
    <svg viewBox="0 0 48 48" fill="none" style="width:${size}px; height:${size}px;">
      <path d="M36 20H14a7 7 0 01-.5-14A9 9 0 0134 8a6 6 0 012 12z" fill="#3B82F6" opacity="0.15" />
      <path d="M36 20H14a7 7 0 01-.5-14A9 9 0 0134 8a6 6 0 012 12z" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" />
      <line x1="14" y1="24" x2="12" y2="30" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" style="animation: heavyDrop 0.6s infinite ease-in 0s;" />
      <line x1="21" y1="24" x2="19" y2="30" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" style="animation: heavyDrop 0.6s infinite ease-in 0.2s;" />
      <line x1="28" y1="24" x2="26" y2="30" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" style="animation: heavyDrop 0.6s infinite ease-in 0.4s;" />
      <line x1="35" y1="24" x2="33" y2="30" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" style="animation: heavyDrop 0.6s infinite ease-in 0.1s;" />
    </svg>`,

  Snow: (size = 48) => `
    <svg viewBox="0 0 48 48" fill="none" style="width:${size}px; height:${size}px;">
      <path d="M36 22H14a7 7 0 01-.5-14A9 9 0 0134 10a6 6 0 012 12z" fill="#CBD5E1" opacity="0.2" />
      <path d="M36 22H14a7 7 0 01-.5-14A9 9 0 0134 10a6 6 0 012 12z" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" />
      <circle cx="16" cy="26" r="1.8" fill="#CBD5E1" style="animation: snowFlake 2s infinite ease-in 0s;" />
      <circle cx="22" cy="26" r="1.8" fill="#CBD5E1" style="animation: snowFlake 2s infinite ease-in 0.5s;" />
      <circle cx="28" cy="26" r="1.8" fill="#CBD5E1" style="animation: snowFlake 2s infinite ease-in 0.2s;" />
      <circle cx="34" cy="26" r="1.8" fill="#CBD5E1" style="animation: snowFlake 2s infinite ease-in 0.7s;" />
    </svg>`,

  Thunder: (size = 48) => `
    <svg viewBox="0 0 48 48" fill="none" style="width:${size}px; height:${size}px;">
      <path d="M36 20H14a7 7 0 01-.5-14A9 9 0 0134 8a6 6 0 012 12z" fill="#F59E0B" opacity="0.1" />
      <path d="M36 20H14a7 7 0 01-.5-14A9 9 0 0134 8a6 6 0 012 12z" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />
      <path d="M26 20l-3 8h6l-3 10" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: flashLightning 2.5s infinite;" />
    </svg>`,

  Fog: (size = 48) => `
    <svg viewBox="0 0 48 48" fill="none" style="width:${size}px; height:${size}px;">
      <line x1="10" y1="16" x2="38" y2="16" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" style="animation: floatFog 3s infinite ease-in-out 0s;" />
      <line x1="8" y1="22" x2="40" y2="22" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" style="animation: floatFog 3s infinite ease-in-out 0.5s;" />
      <line x1="12" y1="28" x2="36" y2="28" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" style="animation: floatFog 3s infinite ease-in-out 1s;" />
    </svg>`
};

function getAnimatedWeatherIcon(weatherId, isNight = false, size = 64) {
  if (weatherId >= 200 && weatherId < 300) return WeatherIcons.Thunder(size);
  if (weatherId >= 300 && weatherId < 500) return WeatherIcons.Rain(size);
  if (weatherId >= 500 && weatherId < 600) return WeatherIcons.HeavyRain(size);
  if (weatherId >= 600 && weatherId < 700) return WeatherIcons.Snow(size);
  if (weatherId >= 700 && weatherId < 800) return WeatherIcons.Fog(size);
  if (weatherId === 800) return isNight ? WeatherIcons.Moon(size) : WeatherIcons.Sun(size);
  if (weatherId === 801 || weatherId === 802) return WeatherIcons.PartlyCloudy(size);
  return WeatherIcons.Cloud(size);
}
