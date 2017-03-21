/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById('btnAU').addEventListener('click', this.captureAudio.bind(this));
        document.getElementById('btnAUStop').addEventListener('click', this.stopAudio.bind(this));

    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.debug("Device ready...");
		console.log(navigator.device.capture);
		if (navigator.device.capture) {
        	this.debug("Capture ready...");
		}
    },

    debug: function(str) {
        var elem = document.getElementById('debug');
        if (elem) {
            elem.innerHTML += "\n<br>" + str;
        }
    },

	captureAudio: function() {
        this.debug("Recording Audio...");
        this.mediaCapture = navigator.device.capture.captureAudio(this.captureAudioSuccess.bind(this)
            , this.captureAudioError.bind(this)
            , { limit: 1, duration: 2000 });
        //XXX hack
        this.mediaCapture = top.CURRENT_MEDIA_CAPTURE;
    },

    stopAudio: function () {
        if (!this.mediaCapture) {
            this.debug("No audio recording now...");
            return;
        }
        var that = this;
        var capturedFile = top.CURRENT_CAPTURED_FILE;

        this.mediaCapture.stopRecordAsync().then(function () {
            that.debug("Recording stopped.")
            that.mediaCapture = null;
            capturedFile.getBasicPropertiesAsync().then(function (basicProperties) {
                var result = new MediaFile(capturedFile.name, 'ms-appdata:///local/' + capturedFile.name, capturedFile.contentType, basicProperties.dateModified, basicProperties.size);
                result.fullPath = capturedFile.path;
                that.captureAudioSuccess([result]);
            }, function () {
                that.captureAudioError(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
            });
        });
    },

    // capture callback
    captureAudioSuccess: function (mediaFiles) {
        this.debug("Audio Capture OK");
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            this.debug(path);
            this.debug("You can play");
            var elem = document.getElementById("audioControl");
            elem.src = mediaFiles[i].localURL;
            elem.load();
        }
    },

    // capture error callback
    captureAudioError: function (error) {
        this.debug("Audio ERROR:" + error);
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    },


	capturePhoto: function() {
		this.debug("Photo capture...");
	},

	captureVideo: function() {
		this.debug("Video capture...");
	}

};

app.initialize();
