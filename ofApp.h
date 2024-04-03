#include "ofMain.h"

class ofApp : public ofBaseApp {

public:
	void setup();
	void draw();
	void refresh();
	float triangle(float input);
	float phasor(float input, float frequency);
	float averageTwo(float inputA, float inputB);
	void setUniforms();
	void exit();
	ofShader shader;
	ofFbo buffer;
	float width;
	float height;
	ofVec2f window;
	ofVec4f red;
	ofVec4f green;
	ofVec4f blue;
	float feedback;
	float frameRate;
	float progress = 0;
	float progressIncrement;
	const float length = 160.0;
	array<float, 7> phasors;
	array<float, 7> triangles;
	float redAmp;
	float greenAmp;
	float blueAmp;
	float redGreenSum;
	float redBlueSum;
	float greenBlueSum;
	float redGreenDifference;
	float redBlueDifference;
	float greenBlueDifference;
};