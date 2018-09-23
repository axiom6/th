import Util from '../util/Util.js';
var Stream,
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf;

Stream = class Stream {
  constructor(bundleNames, infoSpec) {
    var i, len, name, ref;
    this.bundleNames = bundleNames;
    this.infoSpec = infoSpec;
    this.bundles = {};
    ref = this.bundleNames;
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      this.addBundle(name);
    }
    this.counts = {};
  }

  createBundle() {
    var bundle;
    bundle = {};
    bundle.subject = new Rx.Subject();
    bundle.subscribers = {};
    return bundle;
  }

  addBundle(name, warn = true) {
    if (this.bundles[name] == null) {
      this.bundles[name] = this.createBundle();
    } else {
      if (warn) {
        console.warn('Stream.addBundle() bundle subject already exists', name);
      }
    }
  }

  hasBundle(name) {
    return this.bundles[name] != null;
  }

  logBundles() {
    var bundle, key, ref;
    console.log('Stream.Bundles --- ');
    ref = this.bundles;
    for (key in ref) {
      bundle = ref[key];
      console.log(`  Bundle ${key}`);
    }
  }

  // Get a subject by name. Create a new one if need with a warning
  getBundle(name, warn = true) {
    if (this.bundles[name] == null) {
      if (warn) {
        console.warn('Stream.getBundle() unknown name for bundle subject so creating one for', name);
      }
      this.addBundle(name, false);
    }
    return this.bundles[name];
  }

  getSubscriber(name, source, issueError) {
    if (!((this.bundles[name] != null) && (this.bundles[name].subscriber[source] != null))) {
      if (issueError) {
        console.error('Stream.getSubscriber() unknown subscriber', name);
      }
      return null;
    } else {
      return this.bundles[name].subscriber[source];
    }
  }

  subscribe(name, source, next, onError = this.onError, onComplete = this.onComplete) {
    var bundle;
    bundle = this.getBundle(name, false);
    bundle.subscribers[source] = bundle.subject.subscribe(next, onError, onComplete);
    if (this.infoSpec.subscribe && this.isInfo(name)) {
      console.info('Strean.subscribe()', {
        subject: name,
        subscriber: source
      });
    }
  }

  publish(name, topic, jQuerySelector = null, eventType = null, htmlId = "") {
    var subject;
    if ((jQuerySelector != null) && (eventType != null) && (htmlId != null)) {
      this.publishEvent(name, topic, jQuerySelector, eventType, htmlId);
    } else {
      subject = this.getBundle(name).subject;
      subject.next(topic);
    }
    if (this.infoSpec.publish && this.isInfo(name)) {
      console.info('Strean.publish()', {
        subject: name,
        topic: topic
      });
    }
  }

  publishEvent(name, topic, jQuerySelector, eventType, htmlId = "") {
    var element, onEvent, subject;
    subject = this.getBundle(name).subject;
    element = this.domElement(jQuerySelector, htmlId);
    if (this.notElement(element, name)) {
      return;
    }
    onEvent = (event) => {
      this.processEvent(event);
      return subject.next(topic);
    };
    element.addEventListener(eventType, onEvent);
  }

  unsubscribeAll() {
    var bundle, kbun, ksub, ref, ref1, subscriber;
    ref = this.bundles;
    for (kbun in ref) {
      if (!hasProp.call(ref, kbun)) continue;
      bundle = ref[kbun];
      ref1 = bundle.subscribers;
      for (ksub in ref1) {
        if (!hasProp.call(ref1, ksub)) continue;
        subscriber = ref1[ksub];
        this.unsubscribe(kbun, ksub);
      }
    }
  }

  unsubscribe(name, source) {
    if (this.bundles[name] != null) {
      if (this.bundles[name].subscribers[source] != null) {
        this.bundles[name].subscribers[source].unsubscribe();
      } else {
        console.error('Strean.unsubscribe() unknown subscriber', {
          subject: name,
          subscriber: source
        });
      }
    } else {
      console.error('Strean.unsubscribe() unknown subject', {
        subject: name,
        subscriber: source
      });
    }
    if (this.infoSpec.subscribe && this.isInfo(name)) {
      console.info('Strean.unsubscribe()', {
        subject: name,
        subscriber: source
      });
    }
  }

  isInfo(name) {
    return Util.inArray(this.infoSpec.subjects, name);
  }

  notElement(element, name) {
    var status;
    status = (element != null) && (element.id != null) && Util.isStr(element.id);
    if (!status) {
      console.log('Stream.notElement()', name);
    }
    return !status;
  }

  processEvent(event) {
    if (event != null) {
      event.stopPropagation(); // Will need to look into preventDefault
    }
    if (event != null) {
      event.preventDefault();
    }
  }

  complete(completeSubject, subjects, onComplete) {
    var i, len, objects, onNext, subject;
    this.counts[completeSubject] = {};
    this.counts[completeSubject].count = 0;
    objects = [];
    onNext = (object) => {
      objects.push(object);
      this.counts[completeSubject].count++;
      if (this.counts[completeSubject].count === subjects.length) {
        this.counts[completeSubject].count = 0;
        if (typeof onComplete === 'function') {
          return onComplete(objects);
        } else {
          return this.publish(completeSubject, objects);
        }
      }
    };
    for (i = 0, len = subjects.length; i < len; i++) {
      subject = subjects[i];
      this.subscribe(subject, onNext);
    }
  }

  concat(name, sources, onComplete) {
    var i, len, onError, onNext, source, sub, subs;
    subs = [];
    for (i = 0, len = sources.length; i < len; i++) {
      source = sources[i];
      sub = this.getSubject(source).take(1);
      subs.push(sub);
    }
    this.bundles[name] = Rx.Observable.concat(subs).take(subs.length);
    //console.log( 'Stream.concat() subs.length', subs.length )
    onNext = function(object) {
      var params;
      params = object.params != null ? object.params : 'none';
      return Util.noop(params);
    };
    //console.log( 'Stream.concat() next params', params )
    onError = function(err) {
      return console.error('Stream.concat() error', err);
    };
    this.subscribe(name, onNext, onError, onComplete);
  }

  isJQuery($elem) {
    return (typeof $ !== "undefined" && $ !== null) && ($elem != null) && ($elem instanceof $ || indexOf.call(Object($elem), 'jquery') >= 0);
  }

  isEmpty($elem) {
    return ($elem != null ? $elem.length : void 0) === 0;
  }

  domElement(jQuerySelector, htmlId = "") {
    if (this.isJQuery(jQuerySelector)) {
      if (this.isEmpty(jQuerySelector)) {
        console.warn("Stream.domElement() jQuerySelector empty", {
          htmlId: htmlId
        });
      }
      if (this.isEmpty(jQuerySelector)) {
        console.trace();
      }
      return jQuerySelector.get(0);
    } else if (Util.isStr(jQuerySelector)) {
      return $(jQuerySelector).get(0);
    } else {
      console.error('Stream.domElement( jqSel )', typeof jQuerySelector, jQuerySelector, 'jQuerySelector is neither jQuery object nor selector', {
        htmlId: htmlId
      });
      return $().get(0);
    }
  }

  onNext(object) {
    return console.log('Stream.onNext()', object);
  }

  onError(error) {
    return console.error('Stream.onError()', error);
  }

  onComplete() {
    return console.log('Stream.onComplete()', 'Completed');
  }

  infoSubjects() {
    var key, obj, ref, results;
    ref = this.bundles;
    results = [];
    for (key in ref) {
      obj = ref[key];
      results.push(console.info('Stream.logSubjects', key));
    }
    return results;
  }

  drag(jqSel) {
    var dragTarget, mousedown, mousedrag, mousemove, mouseup;
    dragTarget = this.createRxJQuery(jqSel); // Note $jQuery has to be made reative with rxjs-jquery
    
    // Get the three major events
    mouseup = dragTarget.bindAsObservable("mouseup").publish().refCount();
    mousemove = $(document).bindAsObservable("mousemove").publish().refCount();
    mousedown = dragTarget.bindAsObservable("mousedown").publish().refCount().map(function(event) { // calculate offsets when mouse down
      event.preventDefault();
      return {
        left: event['clientX'] - dragTarget.offset().left,
        top: event['clientY'] - dragTarget.offset().top
      };
    });
    // Combine mouse down with mouse move until mouse up
    mousedrag = mousedown.selectMany(function(offset) {
      return mousemove.map(function(pos) { // calculate offsets from mouse down to mouse moves
        return {
          left: pos.clientX - offset.left,
          top: pos.clientY - offset.top
        };
      }).takeUntil(mouseup);
    });
    // Update position subscription =
    return mousedrag.subscribe(function(pos) {
      return dragTarget.css({
        top: pos.top,
        left: pos.left
      });
    });
  }

};

/*
eventTopic:( event ) ->
topic = 'Down'
topic = 'Left'  if event.which is 37
topic = 'Up'    if event.which is 38
topic = 'Right' if event.which is 39
topic = 'Down'  if event.which is 40
topic
*/
export default Stream;
