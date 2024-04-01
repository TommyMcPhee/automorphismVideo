#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
	shader.load("fonemaShader");
	buffer.allocate(ofGetScreenWidth(), ofGetScreenHeight());
	buffer.begin();
	ofClear(0, 0, 0, 255);
	buffer.end();
}

//--------------------------------------------------------------
void ofApp::draw(){
	refresh();
	mod3 = fmod(progress, 1.0 / 3.0);
	mod4 = fmod(progress, 0.25);
	mod5 = fmod(progress, 0.2);
	mod7 = fmod(progress, 1.0 / 7.0);
	tri3 = triangle(mod3);
	tri5 = triangle(mod5);
	tri7 = triangle(mod7);
	if (progress >= 0.5) {
		feedback = mod4;
	}
	else {
		feedback = 1.0 - mod4;
	}
	red.set(ofRandomf(), ofRandomf(), 1.0 - tri3, tri3);
	green.set(ofRandomf(), ofRandomf(), 1.0 - tri5, tri5);
	blue.set(ofRandomf(), ofRandomf(), 1.0 - tri7, tri7);
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

float ofApp::triangle(float input) {
	return abs(input - 0.5) * 2.0;
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