#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup() {
	shader.load("fonemaShader");
	buffer.allocate(ofGetScreenWidth(), ofGetScreenHeight());
	buffer.begin();
	ofClear(0, 0, 0, 255);
	buffer.end();
}

//--------------------------------------------------------------
void ofApp::draw() {
	refresh();
	for (int a = 0; a < phasors.size(); a++) {
		phasors[a] = phasor(progress, (float)a + 1);
		triangles[a] = triangle(phasors[a]);
	}
	if (progress >= 0.5) {
		feedback = phasors[3];
	}
	else {
		feedback = 1.0 - phasors[3];
	}
	redAmp = 1.0 - triangles[2];
	greenAmp = 1.0 - triangles[4];
	blueAmp = 1.0 - triangles[6];
	redGreenSum = averageTwo(redAmp, greenAmp);
	redBlueSum = averageTwo(redAmp, blueAmp);
	greenBlueSum = averageTwo(greenAmp, blueAmp);
	redGreenDifference = abs(redAmp - greenAmp);
	redBlueDifference = abs(redAmp - greenAmp);
	greenBlueDifference = abs(greenAmp - blueAmp);
	red.set(ofRandomf(), ofRandomf(), redAmp, greenBlueSum);
	green.set(ofRandomf(), ofRandomf(), greenAmp, redBlueSum);
	blue.set(ofRandomf(), ofRandomf(), blueAmp, redGreenSum);
	buffer.begin();
	shader.begin();
	setUniforms();
	buffer.draw(0, 0);
	shader.end();
	buffer.end();
	buffer.draw(0.0, 0.0);
}

void ofApp::refresh() {
	frameRate = ofGetFrameRate();
	progressIncrement = 1.0 / (frameRate * length + 1.0);
	progress += progressIncrement;
	if (progress > 1.0) {
		exit();
	}
	width = (float)ofGetWidth();
	height = (float)ofGetHeight();
	buffer.allocate(width, height);
	ofClear(0, 0, 0, 255);
	window.set(width, height);
}

float ofApp::phasor(float input, float frequency) {
	return fmod(input, 1.0 / frequency) * frequency;
}

float ofApp::triangle(float input) {
	return abs(input - 0.5) * 2.0;
}

float ofApp::averageTwo(float inputA, float inputB) {
	return (inputA + inputB) / 2.0;
}

void ofApp::setUniforms() {
	shader.setUniform2f("window", window);
	shader.setUniform4f("red", red);
	shader.setUniform4f("green", green);
	shader.setUniform4f("blue", blue);
	shader.setUniform1f("feedback", feedback);
	shader.setUniform1f("progress", progress);
}

void ofApp::exit() {

}