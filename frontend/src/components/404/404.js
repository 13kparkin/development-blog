function check404() {
  // Get the body element
  const body = document.body;

  // Define the statement that should trigger the redirect
  const triggerStatement = "FILE FOUND!";

  // Define the statement that should not be present
  const forbiddenStatement = "ERROR 404!";

  // Check if the trigger statement is present in the body and the forbidden statement is not present
  if (
    body.innerText.includes(triggerStatement) &&
    !body.innerText.includes(forbiddenStatement)
  ) {
    // If the trigger statement is found and the forbidden statement is not present, 
    // redirect to the homepage
    window.location.href = "../index.html";
  
    
  }
}

// Set the interval at which the function should be executed (in milliseconds)
const interval = 3000;

// Start the interval
setInterval(check404, interval);
