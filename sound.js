var ac = new webkitAudioContext();
function osc(pitch){
	oscillator = ac.createOscillator(),
	oscillator.type = waveform;
	oscillator.frequency.value = pitch;
	gainNode = ac.createGainNode();
	oscillator.connect(gainNode);
	gainNode.connect(ac.destination);
	gainNode.gain.value = 1;
	return {osc: oscillator, gain: gainNode};
};

var width = 550,
	height = 800;

var y = d3.scale.log()
	.domain([100, 600])
	.range([height + "px", 0 + "px"])

var beats = 16;	
var bpm = 120;

var scales = {	Major:		[130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63, 146.83*2, 164.81*2, 174.61*2, 196.00*2, 220.00*2, 246.94*2, 261.63*2],
				Minor:		[130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63, 146.83*2, 155.56*2, 174.61*2, 196.00*2, 207.65*2, 233.08*2, 261.63*2],
				Blues:		[130.81, 155.56, 164.81, 174.61, 185.00, 233.08, 246.94, 261.63, 155.56*2, 164.81*2, 174.61*2, 185.00*2, 233.08*2, 246.94*2, 261.63*2],
				Pentatonic: [130.81, 232.55, 147.16, 174.41, 196.215]};
				 
var pitchNums = scales.Minor;
var pitches = createPitchArray(pitchNums);

var waveform = 1;
function createPitchArray(p){
	var rv = [];
	for (var i = 0; i < beats; i++){
		for (var j = 0; j < p.length; j++){
			var pitch = {};
			pitch.num = j;
			pitch.hz = p[j];
			pitch.clicked = false;
			pitch.beat = i;
			rv.push(pitch);
		}
	}
	return rv;
}


var svg = d3.select("#synth").append("svg")
		.attr("width", width)
		.attr("height", height)

var rects = svg.selectAll("rect")
		.data(pitches)
	.enter().append("rect")
		.attr("x", function(d){return 10 + d.beat*30})
		.attr("y", function(d){return y(d.hz);})
		.attr("width", 24)
		.attr("height", 8)
		.attr("stroke-width", "4")
		.attr("stroke", "lightgrey")
		.attr("fill", "lightgrey")
		.attr("class", function(d){return d.beat})
		.on("click", function(d){
			d.clicked = !d.clicked;
			d3.select(this).attr("stroke", d.clicked ? 'steelblue' : 'lightgrey');
		})
		.on("mouseover", function (d){
			d3.select(this)
					.attr("fill", "lightblue")
				.transition()
					.duration(500)
					.attr("fill", "steelblue");
		})
		.on("mouseout", function (d){
			d3.select(this)
			.transition()
				.duration(1000)
				.attr("fill", "lightgrey");
		})


var scheduleAheadTime = .4;
var currentBeat = 0;
var noteLength = .1;
var pitch = 100;
var nextNoteTime = ac.currentTime;
function scheduler(){	
	//console.log(nextNoteTime + " " + ac.currentTime + " " + scheduleAheadTime);
	while (nextNoteTime < ac.currentTime + scheduleAheadTime){
		scheduleNote(currentBeat, nextNoteTime);
		nextNote();
	}
	if (ac.currentTime == 0){
		osc(0);
	}
}

//looks through rects, scheduling a noises for on beat clicked ones
function scheduleNote(beat, time){
	rects.attr("beep", function(d){
			if (d.beat == beat){
				if (d.clicked){
					var o = osc(pitchNums[d.num]*pitch/100);
					o.osc.start(time);
					o.osc.stop(time + noteLength);
				}
				d3.select(this).attr("fill", d.clicked ? "steelblue" : "#bfbfbf") 
					.transition()
						.duration(1500*100/bpm)
						.attr("fill", "lightgrey")
						.attr("y", function(d){return y(d.hz);});
			}
		});
	//console.log(beat);
}

//advances note and time by one beat
function nextNote(){
	var secondsPerBeat = 30/bpm;
	nextNoteTime += secondsPerBeat;

	currentBeat = (currentBeat + 1)%16;
}

$(document).ready(function(){	
	ac.createGainNode();
	setInterval(scheduler, 25);
});

function updateScale(newScale){
	pitches = createPitchArray(scales[newScale]);
	rects.data(pitches)
		.transition()
			.duration(1000)
			.attr("y", function(d){return y(d.hz);});

	rects.exit().remove();
}