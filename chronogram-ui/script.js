// TODO:
// When ".interactive" scrolled over, get the
	// percent across the X axis it is.

function newOnMouseMove( inEl, outEl, screenshots, screenshotCount ) {
	return function( ev ) {

		/*
		let percent = 0.0
		console.log( "percent: " + percent + "%" )
		*/

		let x = ev.clientX;
		let y = ev.clientY;
		let boundingRect = inEl.getBoundingClientRect()
		let offsetLeft = boundingRect.left;
		let offsetTop = boundingRect.top;

		let inElLocalTouchedX = x - offsetLeft;
		let inElLocalTouchedY = y - offsetTop;
		let percentX = inElLocalTouchedX / inEl.offsetWidth;
		let percentY = inElLocalTouchedX / inEl.offsetHeight;

		if ( inElLocalTouchedX < 0 ) { inElLocalTouchedX = 0 }
		if ( inElLocalTouchedY < 0 ) { inElLocalTouchedY = 0 }
		if ( inElLocalTouchedX > inEl.offsetWidth ) { inElLocalTouchedX = inEl.offsetWidth }
		if ( inElLocalTouchedY > inEl.offsetHeight ) { inElLocalTouchedY = inEl.offsetHeight }
		if ( percentX < 0 ) { percentX = 0 }
		if ( percentY < 0 ) { percentY = 0 }
		if ( percentX > 100 ) { percentX = 100 }
		if ( percentY > 100 ) { percentY = 100 }

		console.log( "(" + inElLocalTouchedX + "," + inElLocalTouchedY + ")" );
		console.log( "percentX: " + percentX );

		// TODO: Move the marker under the inEl.
		let marker = inEl.getElementsByClassName( "marker" )[ 0 ];

		if ( marker ) {
			//marker.style.left = inElLocalTouchedX - ( marker.offsetWidth / 2 ) + "px";
			marker.style.left = "calc( " + percentX*100 + "% - " + marker.offsetWidth + "px )";
		}

	}
}

function makeSlide( inEl, outEl, screenshots, screenshotCount ) {
	if ( inEl ) {
		inEl.addEventListener( "mousemove", newOnMouseMove( inEl, outEl, screenshots, screenshotCount ) );
	}
}


window.addEventListener( "DOMContentLoaded", ( ev ) => {

	console.log( "DOM fully loaded and parsed" );

	// Add the touchMoved listener to the .interactive elements.
	let els = document.getElementsByClassName( "interactive" );

	for ( let el of els ) {

		let outEl = el.parentElement.parentElement.getElementsByClassName( "screenshot" )[ 0 ]
		console.log( outEl );
		makeSlide(
			el,
			outEl,
			[
				{ url: "", timestamp: "" },
				{ url: "", timestamp: "" },
				{ url: "", timestamp: "" },
			], 3
		);
	}

} );



/* Effects */
/* When we hover over a ".titleContainer .row", get its
	data-row-id and highlight the corresponding ".interactive .row". */
