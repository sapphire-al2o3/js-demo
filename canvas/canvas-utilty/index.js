(function() {

CanvasRenderingContext2D.prototype.strokeLine = function(a, b, c, d) {
  this.beginPath();
  this.moveTo(a, b);
  this.lineTo(c, d);
  this.stroke();
};


CanvasRenderingContext2D.prototype.fillRoundRect = function(x, y, w, h, r) {
  this.beginPath();
  this.moveTo(x, y + r);
  this.lineTo(x, y + h - r);
  this.quadraticCurveTo(x, y + h, x + r, y + h);
  this.lineTo(x + w - r, y + h);
  this.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
  this.lineTo(x + w, y + r);
  this.quadraticCurveTo(x + w, y, x + w - r, y);
  this.lineTo(x + r, y);
  this.quadraticCurveTo(x, y, x, y + r);
  this.fill();
};


CanvasRenderingContext2D.prototype.strokeRoundRect = function(x, y, w, h, r) {
  this.beginPath();
  this.moveTo(x, y + r);
  this.lineTo(x, y + h - r);
  this.quadraticCurveTo(x, y + h, x + r, y + h);
  this.lineTo(x + w - r, y + h);
  this.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
  this.lineTo(x + w, y + r);
  this.quadraticCurveTo(x + w, y, x + w - r, y);
  this.lineTo(x + r, y);
  this.quadraticCurveTo(x, y, x, y + r);
  this.stroke();
};


CanvasRenderingContext2D.prototype.fillCircle = function(x, y, r) {
  this.beginPath();
  this.arc(x, y, r, 0, Math.PI * 2, false);
  this.fill();
};


CanvasRenderingContext2D.prototype.strokeCircle = function(x, y, r) {
  this.beginPath();
  this.arc(x, y, r, 0, Math.PI * 2, false);
  this.stroke();
};


CanvasRenderingContext2D.prototype.strokeEllipse = function(left, top, right, bottom) {
  var halfWidth = (right - left) / 2.0;
  var halfHeight = (bottom - top) / 2.0;
  var x0 = left + halfWidth;
  var y1 = top + halfHeight;
  this.beginPath();
  var cw = 4.0 * (Math.sqrt(2.0) - 1.0) * halfWidth / 3.0;
  var ch = 4.0 * (Math.sqrt(2.0) - 1.0) * halfHeight / 3.0;
  this.moveTo(x0, top);
  this.bezierCurveTo(x0 + cw, top, right, y1 - ch, right, y1);
  this.bezierCurveTo(right, y1 + ch, x0 + cw, bottom, x0, bottom);
  this.bezierCurveTo(x0 - cw, bottom, left, y1 + ch, left, y1);
  this.bezierCurveTo(left, y1 - ch, x0 - cw, top, x0, top);
  this.stroke();
};


CanvasRenderingContext2D.prototype.fillEllipse = function(left, top, right, bottom) {
  var halfWidth = (right - left) / 2.0;
  var halfHeight = (bottom - top) / 2.0;
  var x0 = left + halfWidth;
  var y1 = top + halfHeight;
  var cw = 4.0 * (Math.sqrt(2.0) - 1.0) * halfWidth / 3.0;
  var ch = 4.0 * (Math.sqrt(2.0) - 1.0) * halfHeight / 3.0;
  this.beginPath();
  this.moveTo(x0, top);
  this.bezierCurveTo(x0 + cw, top, right, y1 - ch, right, y1);
  this.bezierCurveTo(right, y1 + ch, x0 + cw, bottom, x0, bottom);
  this.bezierCurveTo(x0 - cw, bottom, left, y1 + ch, left, y1);
  this.bezierCurveTo(left, y1 - ch, x0 - cw, top, x0, top);
  this.fill();
};

})();

function hsva(h,s,v,a){var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m;return 'rgba('+[[v,p,m,m,q,v][i]*255^0,[q,v,v,p,m,m][i]*255^0,[m,m,q,v,v,p][i]*255^0,a].join(',')+')'}


