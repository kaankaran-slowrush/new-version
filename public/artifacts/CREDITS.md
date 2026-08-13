# Fixture imagery — provenance

Every image in this directory is a **fixture**. It stands in for media a user generated,
and it exists so the media components can be judged at real fidelity rather than against
a grey box. None of it is model.store's work, none of it was produced by any model named
in the catalogue, and none of it should survive into production.

## The three `backdrop-*` frames are different

They are not artifacts — they are the ground the **spatial** theme's plane floats over.
They were chosen dark, quiet and non-figurative on purpose: the plane sits on the backdrop
for a whole session, so anything with a subject competes with the interface in front of it.

**Every backdrop is served through a 78% black cap, and that number is not a taste
value.** It is what pins any image's peak luminance to 0.22, which is what lets the glass
panel stay at 50% and still clear 4.5:1 for white text. Measured peaks before the cap:
bokeh 0.755, night 0.854, tunnel 1.000, interior 0.930 — needing 71%, 74%, 78% and 76%
respectively, so 78% is the universal safe value and the one the theme ships. A
workspace-supplied image goes through the same cap; it is the only way a design system can
promise legibility over an image it has never seen.

## Licence

All of these are photographs published on **Unsplash**, retrieved through the Lorem Picsum
mirror at stable IDs. The [Unsplash Licence](https://unsplash.com/license) grants free use,
including commercially, without permission. Attribution is not required; it is recorded
here anyway, because a repository that cannot say where its assets came from is a liability
to whoever inherits it.

## Wiring

Assets are referenced through fixtures, never hard-coded into a component.
`RECENT_ARTIFACTS` and `MODELS` carry an `image`/`coverUrl` field; `ProceduralCover`
renders it when present and falls back to its generated gradient when it is missing — so
deleting this directory degrades the product rather than breaking it. Audio and text
artifacts deliberately carry no image: a waveform and the set text are the correct
representations, not a picture.

## Credits

| File | Photographer | Source |
| --- | --- | --- |
| `backdrop-bokeh.jpg` | Sebastian Muller | https://unsplash.com/photos/VLdaxYyXJvw |
| `backdrop-night.jpg` | Guillaume | https://unsplash.com/photos/revxuIor0nY |
| `backdrop-tunnel.jpg` | Vladimir Kramer | https://unsplash.com/photos/xzZtV9ED5Bs |
| `blossom.jpg` | Rula Sibai | https://unsplash.com/photos/-vq7mi4oF0s |
| `cactus-sphere.jpg` | Oliver Pacas | https://unsplash.com/photos/tZrrWkQT9MM |
| `camera-white.jpg` | Nicola Perantoni | https://unsplash.com/photos/irUQaBK3ydI |
| `canal.jpg` | Emanuele Pinna | https://unsplash.com/photos/3EYK2njhLxc |
| `cars-yellow.jpg` | Dietmar Becker | https://unsplash.com/photos/8Zt0xOOK4nI |
| `city-night.jpg` | Anders Jildén | https://unsplash.com/photos/nrLtvA05jk8 |
| `components.jpg` | Vadim Sherbakov | https://unsplash.com/photos/osSryggkso4 |
| `cup-studio.jpg` | Justin Leibow | https://unsplash.com/photos/ZJsseAxEcqM |
| `cutlery.jpg` | Alejandro Escamilla | https://unsplash.com/photos/8yqds_91OLw |
| `dandelion.jpg` | Coley Christine | https://unsplash.com/photos/GyvMk5pPDXI |
| `desk-flatlay.jpg` | Aleks Dorohovich | https://unsplash.com/photos/nJdwUHmaY8A |
| `flowers.jpg` | Steven Spassov | https://unsplash.com/photos/tVIqMgGlAG0 |
| `grapes.jpg` | Jassy Onyae | https://unsplash.com/photos/1gBUXhf0PtA |
| `heels-red.jpg` | Alejandro Escamilla | https://unsplash.com/photos/jVb0mSn0LbE |
| `interior.jpg` | Luke Chesser | https://unsplash.com/photos/KR2mdHJ5qMg |
| `interior-warm.jpg` | Oleg Chursin | https://unsplash.com/photos/IoCWq07GaG4 |
| `kit-flatlay.jpg` | Vadim Sherbakov | https://unsplash.com/photos/tCICLJ5ktBE |
| `leaf-macro.jpg` | Bartosz Bąk | https://unsplash.com/photos/4bYpcsaDhpE |
| `metal-macro.jpg` | Lucas Boesche | https://unsplash.com/photos/VkuuTRkcRqw |
| `mug-lemon.jpg` | Vee O | https://unsplash.com/photos/hGO27G5tZJ8 |
| `mug-sand.jpg` | Shyamanta Baruah | https://unsplash.com/photos/aeVA-j1y2BY |
| `object-white.jpg` | koichi nakajima | https://unsplash.com/photos/HFbRnCjWHsk |
| `pastries.jpg` | Rafael Souza | https://unsplash.com/photos/QxkBP3A9XmU |
| `peak-clouds.jpg` | Nicholas Swanson | https://unsplash.com/photos/d19by2PLaPc |
| `phone-macro.jpg` | Thom | https://unsplash.com/photos/Zdcq3iKly6g |
| `photographer.jpg` | Jennifer Trovato | https://unsplash.com/photos/baRYCsjO6z4 |
| `portrait-back.jpg` | Alexander Shustov | https://unsplash.com/photos/2FrX56QL7P8 |
| `portrait-field.jpg` | Alexander Shustov | https://unsplash.com/photos/AHBiSKaENwc |
