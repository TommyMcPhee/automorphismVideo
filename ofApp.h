#include "ofMain.h"

class ofApp : public ofBaseApp{

	public:
		void setup();
		void draw();
		void refresh();
		float triangle(float input);
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
		float mod3;
		float mod4;
		float mod5;
		float mod7;
		float tri3;
		float tri5;
		float tri7;
};
