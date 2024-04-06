#version 150
#define TWO_PI 6.283185307179586476925286766559
#define FLT_MIN 1.175494351e-38

uniform sampler2DRect tex0;
in vec2 texCoordVarying;
out vec4 outputColor;
uniform vec2 window;
uniform vec4 red;
uniform vec4 green;
uniform vec4 blue;
uniform vec4 filtration;
uniform vec3 ring;
uniform vec3 average;
uniform float progress;

float weightedRing(float inA, float inB, float weight){
    return pow(inA, 1.0 - weight) * pow(inB, weight);
}

vec2 decenter(vec2 parameters){
    return abs(parameters - 0.5) * 2.0;
}

float decenter(float parameter){
    return abs(parameter - 0.5) * 2.0;
}

float unipolar(float parameter){
    return parameter * 0.5 + 0.5;
}

float oscillate(float phase){
    return 1.0 - unipolar(cos(phase * TWO_PI));
}

float distributeAxis(float parameter, float normalizedComponent){
    float unadjusted = 1.0 - abs(parameter - normalizedComponent);
    return 1.0 - (unadjusted * (1.0 - decenter(parameter)) + unadjusted);
}

float distribute(vec4 parameters, vec2 normalized){
    float distributeX = distributeAxis(parameters.x, normalized.x);
    float distributeY = distributeAxis(parameters.y, normalized.y);
    return pow(distributeX * distributeY, parameters.w / parameters.z);
}

void main()
{
    vec4 lastColor = texture2DRect(tex0, texCoordVarying);
    vec4 translatedColor = texture2DRect(tex0, texCoordVarying * (1.0 + decenter(filtration.xy)) + ((filtration.xy * 2.0 - 1.0) * window));
    vec3 lowPass = translatedColor.rgb;
    vec3 highPass = 1.0 - lowPass;
    vec3 ringPass = vec3(weightedRing(lowPass.r, highPass.r, ring.r), weightedRing(lowPass.g, highPass.g, ring.g), weightedRing(lowPass.b, highPass.b, ring.b));
    vec3 averagePass = mix(lowPass, highPass, average);
    vec3 filterColor = mix(ringPass, averagePass, filtration.z);
    vec2 normalized = gl_FragCoord.xy / window;
    vec2 decentered = decenter(normalized);
    float decenteredFloat = pow(decentered.x * decentered.y, 0.5);
    vec2 centered = 1.0 - decentered;
    float distributionA = oscillate(normalized.x * 4.0) * oscillate(normalized.y * 3.0);
    float redDistribution = mix(distributionA, decentered.y, progress);
    float greenDistribution = mix(distributionA, centered.x * centered.y, progress);
    float blueDistribution = mix(distributionA, decentered.x, progress);
    float unprogress = 1.0 - progress;
    float unfiltrationX = 1.0 - filtration.x;
    float newR = distribute(red, normalized) * redDistribution * oscillate(decenteredFloat / (FLT_MIN + unprogress));
    float newG = distribute(green, normalized) * greenDistribution * oscillate(decenteredFloat / (FLT_MIN + unfiltrationX));
    float newB = distribute(blue, normalized) * blueDistribution  * oscillate(decenteredFloat / (progress + FLT_MIN));
    vec3 newColor = vec3(newR, newG, newB);
    vec3 transformedColor = sin(newColor * filterColor * TWO_PI * filtration.z / (FLT_MIN + filtration.y)) * 0.5 + 0.5;
    vec3 unprocessed = mix(mix(mix(newColor, transformedColor, unfiltrationX), filterColor, filtration.w), lastColor.rgb, progress);
    outputColor = vec4(pow(unprocessed.r, unprogress), pow(unprocessed.g, unprogress), pow(unprocessed.b, unprogress), 1.0);
}