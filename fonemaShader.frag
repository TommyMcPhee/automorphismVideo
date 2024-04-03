#version 150
#define TWO_PI 6.283185307179586476925286766559

uniform sampler2DRect tex0;
in vec2 texCoordVarying;
out vec4 outputColor;
uniform vec2 window;
uniform vec4 red;
uniform vec4 green;
uniform vec4 blue;
uniform float feedback;
uniform float progress;

vec2 decenter(vec2 parameters){
    return abs(parameters - 0.5) * 2.0;
}
float decenter(float parameter){
    return abs(parameter - 0.5) * 2.0;
}

float distributeAxis(float parameter, float normalizedComponent){
    float unadjusted = 1.0 - abs(parameter - normalizedComponent);
    return 1.0 - (unadjusted * decenter(parameter) + unadjusted);
}

float distribute(vec4 parameters, vec2 normalized){
    float distributeX = distributeAxis(parameters.x, normalized.x);
    float distributeY = distributeAxis(parameters.y, normalized.y);
    return distributeX * distributeY;
}

void main()
{
    vec4 lastColor = texture2DRect(tex0, texCoordVarying);
    vec2 normalized = gl_FragCoord.xy / window;
    vec2 decentered = decenter(normalized);
    vec2 centered = 1.0 - decentered;
    float distributionA = centered.x * centered.y;
    float distributionB = pow(1.0 - (decentered.x * decentered.y * distributionA * 2.0), 1.0 / progress);
    float distribution = mix(distributionA, distributionB, progress);
    vec4 newColor = vec4(pow(red.z * distribution, red.w), pow(green.z * distribution, green.w), pow(blue.z * distribution, blue.w), 1.0);
    outputColor = mix(newColor, lastColor, feedback);
}