
function toggleResult(element) {
    
    var test = getAncestor(element, "testcase");
    
    var failure = null;
    for (var i = 0; i < test.childNodes.length; i++) {
        if (test.childNodes[i].className == "failure") {
            failure = test.childNodes[i];
            break;
        }
    }
    
    if (failure != null) {
        if (failure.style.display == "none") {
            failure.style.display = "block";
            
            
            var rect = failure.getBoundingClientRect();
            
            if (!isElementInViewport(failure)) {
            	// If the element is not visible, scroll a bit to bring it into view.
            	var sc = rect.top + (rect.bottom - rect.top) / 2;
            	window.scrollTo(0, sc);
            }
        } else {
            failure.style.display = "none";
        }
    }
}

/**
 * Tests if the given element is visible inside the current viewport.
 * 
 * @param el Element to test.
 * 
 * @returns true if a part of the element is indeed visible.
 */
function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}


function showTest(element) {
    
    var test = getAncestor(element, "testcase");
    
    var testName = test.getAttribute('data-name');
    
    var scenario = getAncestor(element, "testsuite");
    
    var scenarioName = scenario.getAttribute('data-name');
    var scenarioLocation = scenario.getAttribute('data-source');
    
    
    xspecBridge.showTest(testName, scenarioName, scenarioLocation);
}


function runScenario(currentNode) {
    
    var scenario = getAncestor(currentNode, "testsuite");
    
    var scenarioName = scenario.getAttribute('template-id');
    var scenarioLocation = scenario.getAttribute('data-source');
    
    xspecBridge.runScenario(scenarioName, scenarioLocation);
}


function showDiff(currentNode) {
	
	var test = getAncestor(currentNode, "testcase");
    
    var diffData = null;
    for (var i = 0; i < test.childNodes.length; i++) {
        
        if (test.childNodes[i].className == "embeded.diff.data") {
            diffData = test.childNodes[i];
            break;
        }
    }
    
    
    var left = null;
    var right = null;
    for (var i = 0; i < diffData.childNodes.length; i++) {
        if (diffData.childNodes[i].className == "embeded.diff.result") {
            left = diffData.childNodes[i];
        } else if (diffData.childNodes[i].className == "embeded.diff.expected") {
            right = diffData.childNodes[i];
        }
    }
    
    xspecBridge.showDiff(left.innerHTML, right.innerHTML);
}


function getAncestor(element, ancestorClass) {
    var node = element;
    while (node != null && node.className != ancestorClass) {
        node = node.parentElement;
    }
    
    return node;
}

/**
 * Keeps just the failed tests visible. This method is called from the JAVA code, from the action in the view's toolbar.
 */
function showOnlyFailedTests() {
    
    var tcs = document.querySelectorAll(".testcase > p.passed, .testcase > p.skipped");
    for (var i = 0; i < tcs.length; i++) {
        tcs[i].style.display = "none";
    }
    
    var empty = document.querySelectorAll(".testcase, .testsuite");
    for (var i = 0; i < empty.length; i++) {
        var f = empty[i].getElementsByClassName("failed");
        if (f == null || f.length == 0) {
            empty[i].style.display = "none";
        }
    }
}

/**
 * Makes all tests visible. This method is called from the JAVA code, from the action in the view's toolbar.
 */
function showAllTests() {
    var tcs = document.querySelectorAll(".testcase > p, .testcase, .testsuite");
    for (var i = 0; i < tcs.length; i++) {
        tcs[i].style.display = "block";
    }
}

/* *
 * Returns the names of the failed scenarios in an array. An empty array if none.
 */
function getFailedScenarios() {
    var listOfObjects = [];
    var scenarios = document.querySelectorAll(".testsuite");
    for (var i = 0; i < scenarios.length; i++) {
        var scenario = scenarios[i];
        var failures = scenario.getAttribute('data-failures');
        
        if (failures != "0") {
        	// Check if this has any asserts in it. Otherwise is just a grouping scenario.
        	
            var hasAssert = false;
             for (var j = 0; j < scenario.childNodes.length; j++) {
            	 if (scenario.childNodes[j].className == "testcase") {
                    	hasAssert = true;
                    	break;
                    }
             }
        	
            if (hasAssert) {
                var scenarioName = scenario.getAttribute('template-id');
                listOfObjects.push(scenarioName);
            }
        }
    }
    
    return listOfObjects;
}