#version 150
#define TWO_PI 6.283185307179586476925286766559

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
    vec4 lastColor = texture2DRect(tex0, texCoordVarying + ((filtration.xy * 2.0 - 1.0) * window));
    vec3 lowPass = lastColor.rgb;
    vec3 highPass = 1.0 - lowPass;
    vec3 ringPass = vec3(weightedRing(lowPass.r, highPass.r, ring.r), weightedRing(lowPass.g, highPass.g, ring.g), weightedRing(lowPass.b, highPass.b, ring.b));
    vec3 averagePass = mix(lowPass, highPass, average);
    vec3 filterColor = mix(ringPass, averagePass, filtration.z);
    vec2 normalized = gl_FragCoord.xy / window;
    vec2 decentered = decenter(normalized);
    vec2 centered = 1.0 - decentered;
    float distributionA = oscillate(normalized.x * 4.0) * oscillate(normalized.y * 3.0);
    float distributionB = pow(1.0 - (decentered.x * decentered.y * 2.0), 1.0 - progress);
    float distribution = mix(distributionA, distributionB, 0.5);
    vec4 newColor = vec4(distribute(red, normalized), distribute(green, normalized), distribute(blue, normalized), 1.0);
    outputColor = mix(newColor, lastColor, 0.5);
}