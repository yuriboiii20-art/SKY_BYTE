const API_KEY = localStorage.getItem("OWM_API_KEY") || "YOUR_OPENWEATHER_API_KEY";
const el = id => document.getElementById(id);
const loader = el("loader");
const searchInput = el("search-input");
const autocompleteList = el("autocomplete-list");
const notificationEl = el("notification");
const themeCheckbox = el("toggle-mode-checkbox");
const micBtn = el("mic-btn");
const soundscapeBtn = el("soundscape-btn");

let isCelsius = true;
let debounceTimer;
let currentPrecipitationType = null;
let audioContext = null;
let isSoundActive = false;
let currentSynthNodes = [];

/* 🌙 Dark / Day Creative Theme Switch Initialization */
if (localStorage.getItem("mode") === "dark") {
  document.body.classList.add("dark");
  if (themeCheckbox) themeCheckbox.checked = true;
}

if (themeCheckbox) {
  themeCheckbox.onchange = () => {
    if (themeCheckbox.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("mode", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("mode", "light");
    }
  };
}

function notify(msg) {
  notificationEl.textContent = msg || "";
  if (msg) {
    setTimeout(() => {
      notificationEl.textContent = "";
    }, 4000);
  }
}

/* 📍 Auto Location */
window.onload = () => {
  initCanvas();
  navigator.geolocation
    ? navigator.geolocation.getCurrentPosition(
        pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather("Delhi")
      )
    : fetchWeather("Delhi");
};

el("search-btn").onclick = () => {
  hideAutocomplete();
  fetchWeather(searchInput.value.trim());
};

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    hideAutocomplete();
    fetchWeather(searchInput.value.trim());
  }
});

/* 🎙️ Voice Search Feature (Web Speech API) */
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  micBtn.onclick = () => {
    micBtn.classList.add("listening");
    notify("Listening... Speak a city name");
    recognition.start();
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.replace(/\./g, '');
    searchInput.value = transcript;
    micBtn.classList.remove("listening");
    notify(`Searching for "${transcript}"...`);
    fetchWeather(transcript);
  };

  recognition.onerror = () => {
    micBtn.classList.remove("listening");
    notify("Voice recognition failed. Please try typing.");
  };

  recognition.onend = () => {
    micBtn.classList.remove("listening");
  };
} else {
  if (micBtn) micBtn.style.display = "none";
}

/* 🔊 Web Audio API Ambient Soundscape Generator */
if (soundscapeBtn) {
  soundscapeBtn.onclick = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    isSoundActive = !isSoundActive;
    if (isSoundActive) {
      soundscapeBtn.classList.add("active");
      el("sound-icon").textContent = "🔊";
      playAmbientSoundscape();
    } else {
      soundscapeBtn.classList.remove("active");
      el("sound-icon").textContent = "🔇";
      stopAmbientSoundscape();
    }
  };
}

function stopAmbientSoundscape() {
  currentSynthNodes.forEach(node => {
    try { node.stop(); node.disconnect(); } catch (e) {}
  });
  currentSynthNodes = [];
}

function playAmbientSoundscape() {
  stopAmbientSoundscape();
  if (!isSoundActive || !audioContext) return;

  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0.15;
  masterGain.connect(audioContext.destination);

  if (currentPrecipitationType === "rain") {
    const bufferSize = audioContext.sampleRate * 2;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    whiteNoise.start();
    currentSynthNodes.push(whiteNoise);
  } else {
    const osc = audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, audioContext.currentTime);

    const lfo = audioContext.createOscillator();
    lfo.frequency.setValueAtTime(0.2, audioContext.currentTime);
    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 15;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(masterGain);
    osc.start();
    lfo.start();
    currentSynthNodes.push(osc, lfo);
  }
}

/* 🔍 City Autocomplete Feature */
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  clearTimeout(debounceTimer);

  if (query.length < 2) {
    hideAutocomplete();
    return;
  }

  debounceTimer = setTimeout(() => {
    fetchCitySuggestions(query);
  }, 300);
});

function fetchCitySuggestions(query) {
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        hideAutocomplete();
        return;
      }
      showAutocomplete(data);
    })
    .catch(() => hideAutocomplete());
}

function showAutocomplete(cities) {
  autocompleteList.innerHTML = "";
  cities.forEach(city => {
    const item = document.createElement("div");
    item.className = "autocomplete-item";
    const stateStr = city.state ? `, ${city.state}` : "";
    item.innerHTML = `
      <strong>${city.name}</strong>
      <span class="country">${stateStr} (${city.country})</span>
    `;
    item.onclick = () => {
      searchInput.value = `${city.name}`;
      hideAutocomplete();
      fetchWeather(`${city.name},${city.country}`);
    };
    autocompleteList.appendChild(item);
  });
  autocompleteList.style.display = "block";
}

function hideAutocomplete() {
  autocompleteList.style.display = "none";
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container")) {
    hideAutocomplete();
  }
});

function showLoader(v) {
  loader.style.display = v ? "block" : "none";
}

function fetchWeather(city) {
  if (!city) return;
  notify("");
  showLoader(true);
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`)
    .then(r => {
      if (!r.ok) throw new Error("City not found");
      return r.json();
    })
    .then(updateUI)
    .catch((err) => notify(err.message || "City not found"))
    .finally(() => showLoader(false));
}

function fetchByCoords(lat, lon) {
  notify("");
  showLoader(true);
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    .then(r => r.json())
    .then(updateUI)
    .finally(() => showLoader(false));
}

function updateUI(d) {
  // Render Animated Weather Icon instead of static OpenWeather png / emojis
  const isNight = d.weather[0].icon.includes('n');
  el("weather-icon-container").innerHTML = getAnimatedWeatherIcon(d.weather[0].id, isNight, 84);

  el("temp").textContent = `${Math.round(d.main.temp)}°C`;
  el("desc").textContent = d.weather[0].description;
  el("location").textContent = `${d.name}, ${d.sys.country}`;
  el("time").textContent = new Date().toLocaleString();

  el("feels").textContent = Math.round(d.main.feels_like);
  el("humidity").textContent = d.main.humidity;
  el("pressure").textContent = d.main.pressure;
  el("wind").textContent = d.wind.speed;
  el("min").textContent = Math.round(d.main.temp_min);
  el("max").textContent = Math.round(d.main.temp_max);

  el("arrow").style.transform = `rotate(${d.wind.deg}deg)`;

  /* 🌅 Sunrise & Sunset Formatting */
  if (d.sys.sunrise && d.sys.sunset) {
    el("sunrise-time").textContent = new Date(d.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    el("sunset-time").textContent = new Date(d.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /* 💡 Smart Clothing Tip Advisor */
  updateClothingTip(d.main.temp, d.weather[0].main);

  /* 🍃 Air Quality API Fetch */
  fetchAirQuality(d.coord.lat, d.coord.lon);

  /* 🌩 Weather Background Dynamics */
  applyDynamicWeatherBackground(d.weather[0].id, d.weather[0].main);

  /* Audio update if playing */
  if (isSoundActive) playAmbientSoundscape();

  fetchForecast(d.coord.lat, d.coord.lon);
}

/* 💡 Smart Clothing Tip Advisor Logic */
function updateClothingTip(temp, weatherMain) {
  const tipEl = el("clothing-tip");
  if (weatherMain === "Rain" || weatherMain === "Drizzle" || weatherMain === "Thunderstorm") {
    tipEl.textContent = "💡 Tip: Carry an Umbrella ☔";
  } else if (weatherMain === "Snow" || temp <= 5) {
    tipEl.textContent = "💡 Tip: Wear Heavy Coat & Gloves 🧥";
  } else if (temp > 5 && temp <= 15) {
    tipEl.textContent = "💡 Tip: Wear a Jacket or Hoodie 🧥";
  } else if (temp > 15 && temp <= 25) {
    tipEl.textContent = "💡 Tip: Pleasant Weather! T-Shirt & Jeans 👕";
  } else {
    tipEl.textContent = "💡 Tip: Hot Sun! Wear Light Cotton & Sunglasses 🕶️";
  }
}

/* 🍃 Air Quality API Fetch */
function fetchAirQuality(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    .then(r => r.json())
    .then(d => {
      const aqiMap = {
        1: { text: "Good 🟢", color: "#2ed573" },
        2: { text: "Fair 🟡", color: "#eccc68" },
        3: { text: "Moderate 🟠", color: "#ffa502" },
        4: { text: "Poor 🔴", color: "#ff4757" },
        5: { text: "Very Poor 🟣", color: "#9b59b6" }
      };
      const aqi = d.list[0].main.aqi;
      const aqiObj = aqiMap[aqi] || { text: "Normal", color: "#00eaff" };
      el("aqi-val").textContent = aqiObj.text;
      el("aqi-val").style.background = aqiObj.color;
      el("aqi-val").style.color = "#000";
    })
    .catch(() => {
      el("aqi-val").textContent = "N/A";
    });
}

/* 🌡 Temperature Toggle */
el("temp").onclick = () => {
  let t = parseFloat(el("temp").textContent);
  el("temp").textContent = isCelsius
    ? `${Math.round(t * 9/5 + 32)}°F`
    : `${Math.round((t - 32) * 5/9)}°C`;
  isCelsius = !isCelsius;
};

/* 📅 Forecast with Animated SVG Weather Icons */
function fetchForecast(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    .then(r => {
      if (!r.ok) throw new Error("Forecast failed");
      return r.json();
    })
    .then(d => {
      el("forecast").innerHTML = "";
      d.list.filter(i => i.dt_txt.includes("12:00")).slice(0, 5)
        .forEach(day => {
          const isNight = day.sys ? day.sys.pod === 'n' : false;
          const iconSvg = getAnimatedWeatherIcon(day.weather[0].id, isNight, 36);
          el("forecast").innerHTML += `
            <div class="card glass-panel forecast-item">
              <span class="day-name">${new Date(day.dt_txt).toLocaleDateString("en", { weekday: "short" })}</span>
              <div class="forecast-icon">${iconSvg}</div>
              <span class="day-temp">${Math.round(day.main.temp)}°C</span>
            </div>`;
        });
    })
    .catch((err) => {
      console.warn("Forecast fetch warning:", err);
    });
}

/* ⚡️ OPENWEATHER CONDITION MAPPER FOR DYNAMIC BACKGROUND ⚡️ */
let lightningInterval = null;

function applyDynamicWeatherBackground(weatherId, weatherMain) {
  document.body.classList.remove(
    "weather-clear", "weather-clouds", "weather-rain",
    "weather-thunderstorm", "weather-snow", "weather-mist", "weather-default"
  );

  clearInterval(lightningInterval);
  currentPrecipitationType = null;

  if (weatherId >= 200 && weatherId < 300) {
    document.body.classList.add("weather-thunderstorm");
    currentPrecipitationType = "rain";
    startLightningEffect();
  } else if ((weatherId >= 300 && weatherId < 600) || weatherMain === "Rain" || weatherMain === "Drizzle") {
    document.body.classList.add("weather-rain");
    currentPrecipitationType = "rain";
  } else if ((weatherId >= 600 && weatherId < 700) || weatherMain === "Snow") {
    document.body.classList.add("weather-snow");
    currentPrecipitationType = "snow";
  } else if (weatherId >= 700 && weatherId < 800) {
    document.body.classList.add("weather-mist");
  } else if (weatherId === 800 || weatherMain === "Clear") {
    document.body.classList.add("weather-clear");
  } else if (weatherId > 800 || weatherMain === "Clouds") {
    document.body.classList.add("weather-clouds");
  } else {
    document.body.classList.add("weather-default");
  }
}

/* ⚡️ Lightning Generator */
function startLightningEffect() {
  const flashEl = el("lightning-flash");
  lightningInterval = setInterval(() => {
    if (Math.random() > 0.55) {
      flashEl.classList.add("flash");
      setTimeout(() => flashEl.classList.remove("flash"), 60);
      if (Math.random() > 0.4) {
        setTimeout(() => {
          flashEl.classList.add("flash");
          setTimeout(() => flashEl.classList.remove("flash"), 40);
        }, 110);
      }
    }
  }, 3000);
}

/* 🌧 CANVAS PRECIPITATION ANIMATION ENGINE */
let canvas, ctx;
let particles = [];

function initCanvas() {
  canvas = el("precip-canvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(renderCanvas);
}

function createParticles() {
  particles = [];
  const count = 140;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 22 + 12,
      radius: Math.random() * 3.2 + 1.2,
      speedYRain: Math.random() * 12 + 14,
      speedYSnow: Math.random() * 1.6 + 0.8,
      speedX: Math.random() * 1.5 - 0.75,
      opacity: Math.random() * 0.7 + 0.3
    });
  }
}

function renderCanvas() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (currentPrecipitationType === "rain") {
    ctx.strokeStyle = "rgba(174, 218, 255, 0.65)";
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";

    for (let p of particles) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.speedX, p.y + p.length);
      ctx.stroke();

      p.y += p.speedYRain;
      p.x += p.speedX;

      if (p.y > canvas.height) {
        p.y = -p.length;
        p.x = Math.random() * canvas.width;
      }
    }
  } else if (currentPrecipitationType === "snow") {
    for (let p of particles) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      p.y += p.speedYSnow;
      p.x += Math.sin(p.y * 0.015) * 0.9;

      if (p.y > canvas.height) {
        p.y = -p.radius * 2;
        p.x = Math.random() * canvas.width;
      }
    }
  }

  requestAnimationFrame(renderCanvas);
}