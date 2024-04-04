#include "ofMain.h"

class ofApp : public ofBaseApp {

public:
	void setup();
	void draw();
	void refresh();
	float triangle(float input);
	float phasor(float input, float frequency);
	float averageTwo(float inputA, float inputB);
	float normalizedDifference(float inputA, float inputB);
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
	ofVec4f filtration;
	ofVec3f ring;
	ofVec3f average;
	float feedback;
	float frameRate;
	float progress = 0.0;
	float progressIncrement = 0.0;
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