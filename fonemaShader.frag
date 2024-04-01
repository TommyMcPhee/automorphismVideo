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

void main()
{
    vec4 lastColor = texture2DRect(tex0, texCoordVarying);
    vec2 normalized = gl_FragCoord.xy / window;
    vec2 decenter = abs(normalized - 0.5) * 2.0;
    vec2 center = 1.0 - decenter;
    float distributionA = center.x * center.y;
    float distributionB = pow(1.0 - (decenter.x * decenter.y * center.x * center.y * 2.0), 8.0);
    float distribution = mix(distributionA, distributionB, progress);
    vec4 newColor = vec4(red.z * distribution, green.z * distribution, blue.z * distribution, 1.0);
    outputColor = mix(newColor, lastColor, feedback);
}