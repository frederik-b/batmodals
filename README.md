# batmodals

Tested Browserscope:

- IE 11+ (could be adjusted for IE10)
- Edge 11+
- Chrome ?+
- Firefox ?+

Required features:
- ecmascript 5+
- flexbox
- dataset


Usage:
every modal needs to look like this:
```
<div class="modal" data-modal id="m5" hidden>
  <div class="modal__content" style="width:38vw">
    [any content here]
  </div>
</div>
```
there needs to be a node  after the last visible node in the document body, which needs to have the following properties:
```
<div class="modal__helper" data-modal-helper tabindex="0"></div>
```
modals can be defined anywhere, they will be dynamically moved to right in front of the tabHelper
