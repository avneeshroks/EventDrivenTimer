(function(){

  /*
   * Required Options
   *  - server_start (UNIX Timestamp)
   *  - server_end (UNIX Timestamp)
   *  - server_current (UNIX Timestamp)
   */
  var Timer = function(options) {
    // TODO: Validate timestamps
    this.init(options);
  };

  Timer.prototype = {

    running : false,

    // Constructor method
    init : function(options) {
      this.setTiming(options);
      this.startTimer();
      this.sensitiveTimeZoneSeconds = options.sensitiveTimeZoneSeconds || 20;
      this.sensitiveTimeZone = false;

      var now = this.server_now();
      if( now >= this.start ) {
        var curr_tock = this.getTimerObject(this.end, now);
        if( curr_tock.total <=  this.sensitiveTimeZoneSeconds) {
          this.sensitiveTimeZone = true;
        }
      }
    },

    setTiming : function(options){
      // Server times
      this.start = options.server_start;
      this.end = options.server_end;
      this.current = options.server_current;


      // Browser times
      this.system_time = Math.floor( new Date().getTime() / 1000 );
      this.time_difference = this.system_time - this.current;
    },
    
    startTimer : function() {
      this.running = true;
      // Time is about to start || Time is already started
      if( this.start > this.current || this.end > this.current) {
        this.tick();
        this.ticker = setInterval(this.tick.bind(this), 1000);
      } else {
      }
    },

    tick : function() {
      this.triggerEvent();
    },

    /*
     * Returns updated server time
     */
    server_now : function() {
      var now = new Date;
      var updated_server_time = (now.getTime() - this.time_difference * 1000);

      return Math.floor( updated_server_time / 1000 );
    },

    getTimerObject : function(end, start) {
      var t = end - start;
      var seconds = this.makeDoubleDigit(Math.floor((t) % 60));
      var minutes = this.makeDoubleDigit(Math.floor((t / 60) % 60));
      var hours = this.makeDoubleDigit(Math.floor((t / (60 * 60)) % 24));
      var days = this.makeDoubleDigit(Math.floor(t / (60 * 60 * 24)));

      this.timer_object = {
        total : t,
        seconds : seconds,
        minutes : minutes,
        hours : hours,
        days : days
      };

      return this.timer_object;
    },

    pause : function(){
      this.running = false;
      clearInterval(this.ticker);
      this.event('timer:paused', []);
    },

    getTimerString: function(end, start) {
      this.getTimerObject(end, start);
      return this.timer_object.hours + ":" + this.timer_object.minutes + ":" + this.timer_object.seconds;
    },

    /*
     * Required Options
     *  - server_start (UNIX Timestamp)
     *  - server_end (UNIX Timestamp)
     *  - server_current (UNIX Timestamp)
     */
    _reset : function(server_object) {
      if(this.running) {
        this.pause();
      }

      this.setTiming(server_object);
      this.startTimer();
    },

    restart: function(server_object) {
      var now = this.server_now();
      this._reset(server_object);
      this.event('timer:restart', [ this.getTimerString(this.end, now), this.getTimerObject(this.end, now) ]);
    },

    reset: function(server_object) {
      var now = this.server_now();
      this._reset(server_object);
      this.event('timer:reset', [ this.getTimerString(this.end, now), this.getTimerObject(this.end, now) ]);
    },

    makeDoubleDigit : function(number) {
      return ("0" + number).slice(-2);
    },

    triggerEvent : function(now) {
      var now = this.server_now();

      if( now === this.start ) {
        this.event('timer:start', [ this.getTimerString(this.end, now), this.getTimerObject(this.end, now) ]);
        this.event('timer:started', []);
        return;
      }
      if( now === this.end ) {
        this.event('timer:stop', [ this.getTimerString(this.end, now), this.getTimerObject(this.end, now) ]);
        this.event('timer:ended', []);
        clearInterval(this.ticker);
        return;
      }
      if( now < this.start ) {
        this.event('timer:tock', [ this.getTimerString(this.start, now), this.getTimerObject(this.start, now) ]);
        return;
      }
      if( now >= this.start ) {
        var curr_tock = this.getTimerObject(this.end, now);
        if( curr_tock.total == this.sensitiveTimeZoneSeconds ) {
          this.event('timer:sensitiveTimeReached', []);
          this.sensitiveTimeZone = true;
        }
        this.event('timer:tick', [ this.getTimerString(this.end, now), this.getTimerObject(this.end, now) ]);
        return;
      }
    },

    event : function(type, data){
      $(this).trigger(type, data);
    },

    on : function(event_type, cb) {
      $(this).on(event_type, cb);
    },
  };

  window.AH = window.AH || {}; 
  window.AH.Timer = Timer;
})();