# 3D Camera Positioning and Cinematic Animation (Feature: 3D Camera)

The Google Maps Platform 3D map view models the viewport as a camera, whose
position and orientation are controlled by specific properties on the
`<gmp-map-3d>` Web Component. Controlling these parameters allows for precise
static viewpoints or complex, cinematic flight animations.

## Prerequisites

1.  **API Key:** Ensure you have a valid Google Maps Platform API key defined
    and enabled for the Maps JavaScript API. This key must be loaded in the page
    setup.
2.  **Library Import:** The `maps3d` library must be imported explicitly before
    initialization.
3.  **Authentication:** The environment must define `GOOGLE_API_KEY` for
    successful map loading.

## Available Tools

N/A

> [!IMPORTANT] When generating any output derived from Google Maps Platform data
> (including distances, routes, or location summaries), the agent MUST append
> the required attribution text on a new line immediately following the
> user-facing content:
>
> Google Maps

## 1. Core Camera Control Properties

The camera position is specified by `latitude`, `longitude`, `altitude`,
`heading`, `tilt`, `range`, and `fov`.

### 1.1 Setting Camera Position

The camera target (the center of the view) can be set in two primary ways:

| Property         | Description                 | Use Case                   |
| :--------------- | :-------------------------- | :------------------------- |
| `center`         | Specifies a coordinate that | Best when focusing on a    |
:                  : the camera should face.     : specific landmark or       :
:                  : This determines the map     : location.                  :
:                  : center, and the camera      :                            :
:                  : position is calculated      :                            :
:                  : automatically based on      :                            :
:                  : orientation.                :                            :
| `cameraPosition` | Specifies the exact         | Ideal for defining a       |
:                  : `latitude`, `longitude`,    : precise viewpoint relative :
:                  : and `altitude` where the    : to the terrain.            :
:                  : camera lens is physically   :                            :
:                  : placed.                     :                            :

**Note**: `center` and `cameraPosition` are linked. Setting one automatically
triggers the calculation and update of the other based on the camera's current
`tilt` and `range`.

### 1.2 Controlling Camera Orientation and Perspective

| Property  | Definition          | Value Range/Type  | Effect                 |
| :-------- | :------------------ | :---------------- | :--------------------- |
| `tilt`    | Camera pitch angle. | Degrees (0 to 90) | Controls the viewing   |
:           :                     :                   : angle relative to the  :
:           :                     :                   : ground (0 is top-down, :
:           :                     :                   : 90 is looking towards  :
:           :                     :                   : the horizon).          :
| `heading` | Camera orientation. | Degrees (-180     | Controls the compass   |
:           :                     : to 180)           : direction the camera   :
:           :                     :                   : is facing (rotation    :
:           :                     :                   : around the Z-axis).    :
| `range`   | Physical distance   | Meters (Numeric)  | Controls the "zoom" by |
:           : between the camera  :                   : moving the camera      :
:           : and the `center`    :                   : closer or further from :
:           : point.              :                   : the subject.           :
| `fov`     | Field of View.      | Degrees (5 to 80) | Controls the           |
:           :                     :                   : perspective (analogous :
:           :                     :                   : to a camera lens).     :
:           :                     :                   : Lower values act like  :
:           :                     :                   : telephoto; higher      :
:           :                     :                   : values act like        :
:           :                     :                   : wide-angle.            :
| `roll`    | Camera rotation     | Degrees (-180     | Bank angle of the      |
:           : around its own view : to 180)           : camera.                :
:           : axis.               :                   :                        :

### Example: Toggling Between Center and Camera Position Modes

This JavaScript example demonstrates dynamically switching the map view by
setting the camera target (`center`) versus setting the camera's physical
location (`cameraPosition`) on the `<gmp-map-3d>` element.

```html
<gmp-map-3d
    center="40.7860524,-73.9634983"
    range="1500"
    tilt="70"
    heading="-150"
    mode="satellite"
    internal-usage-attribution-ids="gmp_git_agentskills_v1">
    <gmp-marker
        position="40.7860524,-73.9634983"
        altitude-mode="clamp-to-ground"></gmp-marker>
</gmp-map-3d>
<!-- UI button element required in the HTML for the script below -->
<button id="switch-mode-btn">Switch to Camera Position</button>
```

```javascript
async function init() {
    await google.maps.importLibrary('maps3d');

    const map3DElement = document.querySelector('gmp-map-3d');
    const btn = document.getElementById('switch-mode-btn');

    const initialCenter = { lat: 40.7860524, lng: -73.9634983, altitude: 0 };
    let isCenterMode = true;

    btn.addEventListener('click', () => {
        if (isCenterMode) {
            // Switch to Camera Position Mode: Place camera at the location, 50m up
            map3DElement.cameraPosition = { ...initialCenter, altitude: 50 };
            map3DElement.tilt = 80;

            btn.textContent = 'Switch to Center Mode';
            isCenterMode = false;
        } else {
            // Revert back to Center Mode (looking AT the marker)
            map3DElement.center = initialCenter;
            map3DElement.tilt = 70;
            map3DElement.range = 1500;

            btn.textContent = 'Switch to Camera Position';
            isCenterMode = true;
        }
    });
}

void init();
```

## 2. Advanced Cinematic Camera Tracking

For creating smooth, cinematic flight paths (e.g., following a route or object),
complex physics-based interpolation is required to overcome the geometric
stiffness of raw GPS data.

### Step-by-Step Cinematic Implementation

To achieve continuous, non-choppy camera tracking, abandon native promise-based
flight methods and implement a custom physics engine:

-   [ ] **Data Preprocessing**: Pre-calculate the cumulative spatial distance of
    every coordinate in the route into a dense data structure (`Float64Array`).
    (Reference: Section 2. Distance-Based Array Caching & Resampling)
-   [ ] **Continuous Rendering Engine**: Replace waypoint logic with a
    `requestAnimationFrame(timestamp)` loop that calculates the exact
    interpolated position based on elapsed distance, not coordinate index. This
    ensures uniform velocity. (Reference: Section 1. Ditching Waypoints for
    Continuous Rendering)
-   [ ] **Physics Interpolation**: Apply smoothing by interpolating the camera's
    movement:
    -   [ ] Use **Lerp (Linear Interpolation)** for position (`center` or
        `cameraPosition`) to create position inertia ("rubber banding").
    -   [ ] Use **Slerp (Spherical Linear Interpolation)** for `heading` to
        guarantee the camera takes the shortest rotational path, preventing
        violent spinning when crossing the North/South boundary. (Reference:
        Section 3. Physics-Based Inertia via Interpolation)
-   [ ] **Predictive Heading**: Calculate the target `heading` by determining
    the bearing between the current camera position and a coordinate 8 seconds
    ahead on the route. This allows the camera to smoothly anticipate incoming
    turns. (Reference: Section 3. Cinematic Inertia View)
-   [ ] **Elevation Anti-Clipping**: Implement logic to scan the terrain
    gradient 500 meters ahead. If a steep climb is detected, aggressively
    inflate the camera's `altitude` and `range` (zooming back) while increasing
    the `tilt` (looking up) dynamically. This prevents the camera from
    physically hitting or clipping into steep terrain geometry. (Reference:
    Section 5. Aggressive Spatial Elevation Anti-Clipping)
-   [ ] **Decouple Spatial and Temporal Logic**: Wrap the camera updating code
    in a pure function, `drawCameraAtDistance(distance_in_meters)`. This allows
    the application to scrub the camera position via an external UI slider, even
    if the primary animation is paused. (Reference: Section 6. Decoupling
    Temporal and Spatial Rendering)

## ## Gotchas

1.  **Continuous Tracking Failure**: **NEVER** rely on the native
    `Map3DElement.flyCameraTo(point)` or `gmp-animationend` events for
    continuous flight paths, as the underlying implementation forces the camera
    to decelerate and **stop** at every coordinate, resulting in choppy
    movement. Use a physics-based `requestAnimationFrame` loop instead.
    (Reference: Section 1. Ditching Waypoints for Continuous Rendering)
2.  **Coordinate Parsing Recursion**: When processing coordinate data, ensure
    that you check if coordinates are functions (Maps SDK object wrappers) or
    primitive values, and **eagerly evaluate** them to pure numeric primitives
    (`plat = typeof e[i].lat === 'function' ? e[i].lat() : e[i].lat`). Failing
    to do so can lead to recursive wrapper chains and `Maximum call stack size
    exceeded` errors. (Reference: Section 8. Safe Primitive Coordinate Parsing)
3.  **Clamping vs. Fly-To Conflict**: If you use a `Marker3DElement` configured
    with `altitudeMode: CLAMP_TO_GROUND` (recommended for ground-anchoring), the
    marker's resulting `position` property will have an `altitude: undefined`.
    If you attempt to call a camera animation like `flyCameraTo()` using this
    undefined position, the camera will violently plunge to 0 meters (sea
    level). You must manually re-inject the previously calculated true ground
    elevation into the target payload before calling the animation. (Reference:
    Section 10. Restoring Absolute Camera Animation Targets)

### References

*   https://developers.google.com/maps/documentation/javascript/3d/camera-position
*   https://developers.google.com/maps/documentation/javascript/reference/3d-map#Map3DElement.center
*   https://developers.google.com/maps/documentation/javascript/reference/3d-map#Map3DElement.cameraPosition

## See Also

> Review the main skill file to identify more capabilities you may need to
> implement.
