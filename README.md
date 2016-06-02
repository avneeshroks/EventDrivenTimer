# EventDrivenTimer
This is a javascript timer plugin which is event driven

Installation & Usage Guide:

  1. Clone this repository
  2. Include timer.js in your project
  3. create instance of timer by giving following parameters:
    * - server_start (UNIX Timestamp)
    * - server_end (UNIX Timestamp)
    * - server_current (UNIX Timestamp)
    * - sensitiveTimeZoneSeconds [Optional] (seconds) if not given it will take it as 20
  4. Bind various events to make your timmings show:
    Eg:
      var timer = new AH.Timer(attrs.timings);
      this.$timer = $(timer);
      
      this.$timer.on('timer:start', function(e, timer_str, timer_obj){
        // Use your business logic and play with timer_obj :)
      });
    
Events Triggered : 
  
  1. timer:start - when timer starts
  2. timer:stop - when timer stops
  3. timer:tick - when timer is ticking
  4. timer:tock - when timer is yet to start and will start in x:x:x time
  5. timer:restart - when timer is restarted
  6. timer:reset - when timer will be reset to x seconds
  7. timer:sensitiveTimeReached - when the sensitive time left is reached
  
That's it folks.
