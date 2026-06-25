let overlayState = {
  gfx: null,
  asciiChars: " .:-=+*#%@",
  terminalImage: null,
};

const overlayStylesByType = {
  image: ["pixel", "ascii"],
  audio: ["waveform", "pulse"],
  text: ["typewriter", "matrix"],
};

function ensureOverlayGraphics() {
  if (!overlayState.gfx && typeof createGraphics === "function") {
    overlayState.gfx = createGraphics(527, 463);
    overlayState.gfx.pixelDensity(1);
  }
}

function getOverlayStylesForMarker(marker) {
  return overlayStylesByType[marker.type]
}

function setOverlayStyle(marker, offset = 0) {
  const styles = getOverlayStylesForMarker(marker);
  if (!styles) return;
  if (marker.overlayStyleIndex == null) {
    marker.overlayStyleIndex = 0;
  }
  marker.overlayStyleIndex = (marker.overlayStyleIndex + offset + styles.length) % styles.length;
  marker.overlayStyle = styles[marker.overlayStyleIndex];
}

function activateOverlay(marker, type) {
  if (!marker || marker.overlayActive) return;

  marker.overlayActive = true;
  marker.overlayStart = millis();
  marker.overlayType = type;
  

  marker.overlaySuppressed = false;
  setOverlayStyle(marker, 0);
  marker.overlayTextIndex = 0;

  if (type === "audio" && marker.audio) {
    marker.isPlaying = true;
    if (marker.audio.isPlaying()) {
      marker.audio.stop();
    }
    marker.audio.play();
    if (typeof fft !== "undefined") {
      fft.setInput(marker.audio);
    }
  }
}

function reloadOverlay(marker) {
  if (!marker || !marker.overlayActive) return;

  marker.overlayStart = millis();
  marker.overlayTextIndex = 0;

  if (marker.type === "audio" && marker.audio) {
    if (marker.audio.isPlaying()) {
      marker.audio.stop();
    }
    marker.audio.play();
  }
}

function changeOverlayStyle(marker, direction) {
  if (!marker || !marker.overlayActive) return;
  setOverlayStyle(marker, direction);
  marker.overlayStart = millis();
}

function deactivateOverlay(marker, suppressReopen = false) {
  if (!marker || !marker.overlayActive) return;
  marker.overlayActive = false;
  marker.overlaySuppressed = suppressReopen;
  if (marker.type === "audio" && marker.audio) {
    if (marker.audio.isPlaying()) {
      marker.audio.stop();
    }
    marker.isPlaying = false;
  }
}

function getActiveOverlayMarker() {
  return markers.find((marker) => marker.overlayActive);
}

function overlayIsActive() {
  return !!getActiveOverlayMarker();
}

function computeOverlayLayout() {
  const targetW = 527;
  const targetH = 463;
  const scale = min((width - 40) / targetW, (height - 40) / targetH, 1);
  const overlayW = targetW * scale;
  const overlayH = targetH * scale;
  // overlay in right corner 
  const overlayX = (width - overlayW) - 50;
  const overlayY = 50;

  // Overlay in the middle of the screen
  /* const overlayX = (width - overlayW) / 2;
  const overlayY = (height - overlayH) / 2; */
  return { overlayX, overlayY, overlayW, overlayH, scale };
}

function handleOverlayMousePressed() {
  const marker = getActiveOverlayMarker();
  if (!marker) return false;

  const { overlayX, overlayY, overlayW, overlayH, scale } = computeOverlayLayout();
  const relativeX = (mouseX - overlayX) / scale;
  const relativeY = (mouseY - overlayY) / scale;

  if (relativeX < 0 || relativeY < 0 || relativeX > 527 || relativeY > 463) {
    return false;
  }

  if (relativeY <= 30) {
    if (relativeX <= 30) {
      changeOverlayStyle(marker, -1);
      return true;
    }
    if (relativeX <= 65) {
      changeOverlayStyle(marker, 1);
      return true;
    }
    if (relativeX <= 100) {
      reloadOverlay(marker);
      return true;
    }
    if (relativeX >= 150 && relativeX <= 170) {
      deactivateOverlay(marker, true);
      return true;
    }
  }

  if (relativeX <= 527 && relativeY <= 463) {
    return true;
  }

  return false;
}

function drawOverlay(marker) {
  if (!marker || !marker.overlayActive) return;

  const elapsed = millis() - marker.overlayStart;
  if (elapsed > marker.overlayDuration) {
    deactivateOverlay(marker);
    return;
  }

  ensureOverlayGraphics();

  const { overlayX, overlayY, overlayW, overlayH, scale } = computeOverlayLayout();
  const relativeMediaX = 10;
  const relativeMediaY = 80;
  const mediaW = 500;
  const mediaH = 350;

  push();
  resetMatrix();

  if (overlayState.terminalImage) {
    image(overlayState.terminalImage, overlayX, overlayY, overlayW, overlayH);
  } else {
    noStroke();
    fill("#f4b8f9");
    rect(overlayX, overlayY, overlayW, overlayH, 10);
    stroke(255, 255, 255, 200);
    strokeWeight(2);
    noFill();
    rect(overlayX, overlayY, overlayW, overlayH, 10);
  }

  fill("#FF6C02");
  noStroke();
  textFont(robotoMono);
  textSize(16 * scale);
  textAlign(LEFT, TOP);
  text(marker.label, overlayX + 20 * scale, overlayY + 45 * scale);

  // Debug overlays commented out.
  // const debugAreas = [
  //   { x: 0, y: 0, w: 30, h: 30, color: [255, 0, 0, 120] },
  //   { x: 30, y: 0, w: 30, h: 30, color: [0, 255, 0, 120] },
  //   { x: 60, y: 0, w: 30, h: 30, color: [0, 0, 255, 120] },
  //   { x: 120, y: 0, w: 30, h: 30, color: [255, 255, 0, 120] },
  //   { x: 0, y: 30, w: 500, h: 30, color: [255, 128, 0, 80] },
  //   { x: 0, y: 60, w: 500, h: 240, color: [0, 255, 255, 60] },
  // ];

  // for (let area of debugAreas) {
  //   noFill();
  //   stroke(...area.color);
  //   rect(overlayX + area.x * scale, overlayY + area.y * scale, area.w * scale, area.h * scale);
  // }

  push();
  translate(overlayX, overlayY);
  const contentX = relativeMediaX * scale;
  const contentY = relativeMediaY * scale;
  const contentW = mediaW * scale;
  const contentH = mediaH * scale;


  if (marker.overlayType === "image") {
    drawImageTerminal(marker, contentX, contentY, contentW, contentH);
  } else if (marker.overlayType === "audio") {
    drawAudioTerminal(marker, contentX, contentY, contentW, contentH, elapsed);

  }
  pop();

  pop();
}

function drawImageTerminal(marker, x, y, w, h) {
  if (!marker.image) return;
  ensureOverlayGraphics();

  overlayState.gfx.clear();
  overlayState.gfx.background(12, 18, 26);
  overlayState.gfx.image(marker.image, 0, 0, overlayState.gfx.width, overlayState.gfx.height);
  overlayState.gfx.loadPixels();

  if (marker.overlayStyle === "pixel") {
    const cellSize = 14;
    const cols = floor(overlayState.gfx.width / cellSize);
    const rows = floor(overlayState.gfx.height / cellSize);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const sx = col * cellSize;
        const sy = row * cellSize;
        const index = 4 * (sx + sy * overlayState.gfx.width);
        const r = overlayState.gfx.pixels[index];
        const g = overlayState.gfx.pixels[index + 1];
        const b = overlayState.gfx.pixels[index + 2];
        fill(r, g, b, 220);
        noStroke();
        // const jitter = sin((col + row + frameCount * 0.06) * 0.8) * 2;
        const jitter = 0;
        rect(x + col * (w / cols) + jitter, y + row * (h / rows) + jitter, w / cols + 1, h / rows + 1);
      }
    }
  } else if (marker.overlayStyle === "ascii") {
    const chars = overlayState.asciiChars;
    const cellSize = 10;
    const cols = floor(w / cellSize);
    const rows = floor(h / cellSize);
    textSize(10);
    textAlign(LEFT, TOP);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const sx = floor((col / cols) * overlayState.gfx.width);
        const sy = floor((row / rows) * overlayState.gfx.height);
        const idx = 4 * (sx + sy * overlayState.gfx.width);
        const brightness = (overlayState.gfx.pixels[idx] + overlayState.gfx.pixels[idx + 1] + overlayState.gfx.pixels[idx + 2]) / 3;
        const charIndex = floor(map(brightness, 0, 255, chars.length - 1, 0));
        fill("#FF6C02");
        text(chars[charIndex], x + col * cellSize, y + row * cellSize);
      }
    }
  } 
}

function drawAudioTerminal(marker, x, y, w, h, elapsed) {
  if (!marker.audio || !fft) return;

  const waveform = fft.waveform();
  const amp = fft.analyze();
  const midY = y + h / 2;

  if (marker.overlayStyle === "waveform") {
    noFill();
    stroke("#FF6C02");
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
      const px = x + (i / waveform.length) * w;
      const py = midY + waveform[i] * (h / 3);
      curveVertex(px, py);
    }
    endShape();
  
  } else {
    noFill();
    stroke("#FF6C02");
    strokeWeight(1.5);
    for (let ring = 0; ring < 5; ring++) {
      const radius = h * 0.12 + ring * 14 + sin(frameCount * 0.04 + ring) * 6;
      ellipse(x + w / 2, midY, radius + amp[ring] * 0.15, radius + amp[ring] * 0.15);
    }
  }

  fill(120, 255, 220, 120);
  noStroke();
  const progress = constrain(elapsed / marker.overlayDuration, 0, 1);
  rect(x, y + h + 10, w * progress, 5);

  fill("#FF6C02");
  textSize(12);
  textAlign(LEFT, TOP);
  text("waveform live", x, y + h + 18);
}

