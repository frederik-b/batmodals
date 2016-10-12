'use strict';
(function (modal) {
  var debugmode = 0;
  var argv = (decodeURI(Array.prototype.slice.call(document.getElementsByTagName('script')).pop().src).split('?', 2)[1] || '').split('&');
  if (argv.indexOf('debug') !== -1) {
    debugmode = 1;
  }
  if (typeof modal !== 'undefined') {
    // already initialised
    if (debugmode) {
      console.log('modals.js already loaded in version: ' + modal.version);
    }
    return;
  }

  // The namespace object.
  modal = {};

  // Namespaced 'global' variables.

  // Public methods, exposed to namespace.

  modal.show = function() {
    if (!document.querySelectorAll('[data-modal]:not([hidden])').length) {
      document.body.style.paddingRight = window.innerWidth - document.body.clientWidth + 'px';
      document.body.classList.add('noscroll');
    }
    // document.body.appendChild(this);
    document.body.insertBefore(this, document.querySelector('[data-modal-helper]') );
    this.removeAttribute('hidden');
    this.focusBefore = forceFocus(this);
  };

  modal.close = function() {
    if (this === window || !this.dataset.hasOwnProperty('modal')) {
      return;
    }
    this.setAttribute('hidden', '');
    if (this.focusBefore) {
      forceFocus(this.focusBefore);
      delete this.focusBefore;
    }
    if (document.querySelectorAll('[data-modal]:not([hidden])').length) {
      document.body.insertBefore(this, document.querySelector('[data-modal]:not([hidden])'));
    } else {
      document.body.style.paddingRight = '';
      document.body.classList.remove('noscroll');
    }
  };

  modal.initShowButton = function(node) {
    node.addEventListener('click', buttonListener);
  };

  modal.initAllShowButtons = function() {
    Array.prototype.slice.call(document.querySelectorAll('[data-modal-show]')).forEach(modal.initShowButton);
  };

  modal.initModal = function(node) {
    node.addEventListener('click', modalListener);
  };

  modal.initAllModals = function() {
    Array.prototype.slice.call(document.querySelectorAll('[data-modal]')).forEach(modal.initModal);
  };

  modal.initTabtrap = function() {
    document.body.addEventListener('keyup', tabtrapListener);
  };

  modal.initAll = function() {
    modal.initAllShowButtons();
    // modal.initAllHideButtons();
    modal.initAllModals();
    modal.initTabtrap();
  };

  // Internal methods, not exposed to namespace.

  function forceFocus(node) {
    var ret = document.activeElement;
    if (typeof node === 'string') {
      node = document.getElementById(node) || document.querySelector(node);
    }
    if (node.tabIndex === -1) {
      if (node.hasAttribute('tabindex')) {
        // node.setAttribute('tabindex', 0);
        node.focus();
        // node.setAttribute('tabindex', -1);
      } else {
        node.setAttribute('tabindex', 0);
        node.focus();
        node.removeAttribute('tabindex');
      }
    } else {
      node.focus();
    }
    return ret;
  }

  // @this
  function buttonListener() {
    modal.show.call(document.getElementById(this.dataset.modalShow));
  }

  // @this
  function modalListener(event) {
    if (this === event.target) {
      modal.close.call(this);
    }
  }

  function tabtrapListener(event) {
    var activeModal = Array.prototype.slice.call(document.querySelectorAll('[data-modal]:not([hidden])')).pop();
    if (!activeModal) {
      return;
    }
    if (event.keyCode === 27) { // 27 == esc
      modal.close.call(activeModal);
      return;
    }
    if (event.keyCode === 9) { // 9 == tab
      if (activeModal.contains(document.activeElement)) {
        return;
      }
      var focusables = Array.prototype.slice.call(activeModal.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [contenteditable], [tabindex]:not([tabindex^="-"])'));
      if (focusables.length === 0) {
        if (activeModal.tabIndex === -1) {
          if (activeModal.hasAttribute('tabindex')) {
            // activeModal.setAttribute('tabindex', 0);
            activeModal.focus();
            // activeModal.setAttribute('tabindex', -1);
          } else {
            activeModal.setAttribute('tabindex', 0);
            activeModal.focus();
            activeModal.removeAttribute('tabindex');
          }
        } else {
          activeModal.focus();
        }
        return;
      }
      // focus last/first element depending on forward/backward tabbing
      focusables[document.activeElement.dataset.hasOwnProperty('modalHelper')?0:focusables.length-1].focus();
      return;
    }
  }


  if (argv.indexOf('init') !== -1) {
    // auto initialize if script is loaded with a src of 'modals.js?init'
    modal.initAll();
  }
}(window.modal));
