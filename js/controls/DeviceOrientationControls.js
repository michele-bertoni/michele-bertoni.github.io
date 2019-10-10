/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

import {
	Euler,
	Math as _Math,
	Quaternion,
	Vector3
} from "../../../build/three.module.js";

var DeviceOrientationControls = function ( object ) {

	var scope = this;

	this.object = object;
	//this.object.rotation.reorder( 'YXZ' );

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	this.alphaOffset = 0; // radians

	var onDeviceOrientationChangeEvent = function ( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function () {

		scope.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function () {

		var zee = new Vector3( 0, 0, 1 );

		var euler = new Euler();

		var q0 = new Quaternion();

		var q1 = new Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function ( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

		};

	}();

	this.connect = function () {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = true;

	};

	this.disconnect = function () {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	/*this.update = function () {

		if ( scope.enabled === false ) return;

		var device = scope.deviceOrientation;

		if ( device ) {

			var alpha = 0; //scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) + this.alphaOffsetAngle : 0; // Z
			var beta = scope.deviceOrientation.beta ? -THREE.Math.degToRad( scope.deviceOrientation.beta ) + this.betaOffsetAngle : 0; // X'
			var gamma = scope.deviceOrientation.gamma ? -THREE.Math.degToRad( scope.deviceOrientation.gamma ) + this.gammaOffsetAngle : 0; // Y''
			var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

			setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

		}


	};*/

	this.update = function () {
		if ( scope.enabled === false ) return;

		var device = scope.deviceOrientation;

		if ( device ) {
			console.log(device);
			scope.object.set(scope.deviceOrientation.beta*Math.PI/180, scope.deviceOrientation.gamma*Math.PI/180, scope.deviceOrientation.alpha*Math.PI/180);
		}
	}

	this.dispose = function () {

		scope.disconnect();

	};

	this.connect();

};

export { DeviceOrientationControls };
