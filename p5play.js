/**
 * p5play
 * @version 3.8
 * @author quinton-ashley
 * @license gpl-v3-only
 */
p5.prototype.registerMethod('init', function p5PlayInit() {
	if (typeof window.planck == 'undefined') {
		throw 'planck.js must be loaded before p5play';
	}

	// store a reference to the p5 instance that p5play is being added to
	let pInst = this;

	const log = console.log; // shortcut
	this.log = console.log;

	const pl = planck;
	let plScale = 60;

	this.p5play ??= {};
	this.p5play.os ??= {};
	this.p5play.context ??= 'web';
	this.p5play.standardizeKeyboard ??= false;
	this.p5play.sprites = {};
	this.p5play.groups = {};
	this.p5play.groupsCreated = 0;
	this.p5play.spritesCreated = 0;

	// change the angle mode to degrees
	this.angleMode('degrees');

	// scale to planck coordinates from p5 coordinates
	const scaleTo = (x, y, tileSize) => new pl.Vec2((x * tileSize) / plScale, (y * tileSize) / plScale);
	const scaleXTo = (x, tileSize) => (x * tileSize) / plScale;

	// scale from planck coordinates to p5 coordinates
	const scaleFrom = (x, y, tileSize) => new pl.Vec2((x / tileSize) * plScale, (y / tileSize) * plScale);
	const scaleXFrom = (x, tileSize) => (x / tileSize) * plScale;

	const fixRound = (val) => (Math.abs(val - Math.round(val)) <= pl.Settings.linearSlop ? Math.round(val) : val);
	const isArrowFunction = (fn) =>
		!/^(?:(?:\/\*[^(?:\*\/)]*\*\/\s*)|(?:\/\/[^\r\n]*))*\s*(?:(?:(?:async\s(?:(?:\/\*[^(?:\*\/)]*\*\/\s*)|(?:\/\/[^\r\n]*))*\s*)?function|class)(?:\s|(?:(?:\/\*[^(?:\*\/)]*\*\/\s*)|(?:\/\/[^\r\n]*))*)|(?:[_$\w][\w0-9_$]*\s*(?:\/\*[^(?:\*\/)]*\*\/\s*)*\s*\()|(?:\[\s*(?:\/\*[^(?:\*\/)]*\*\/\s*)*\s*(?:(?:['][^']+['])|(?:["][^"]+["]))\s*(?:\/\*[^(?:\*\/)]*\*\/\s*)*\s*\]\())/.test(
			fn.toString()
		);

	/**
	 * Checks if the given string contains a valid collider type
	 * or collider type code letter:
	 *
	 * 'd' or 'dynamic'
	 * 's' or 'static'
	 * 'k' or 'kinematic'
	 * 'n' or 'none'
	 *
	 * @private
	 * @param {String} t type name
	 * @returns {Boolean} true if the given string contains a valid collider type
	 */
	function isColliderType(t) {
		let abr = t.slice(0, 2);
		return t == 'd' || t == 's' || t == 'k' || t == 'n' || abr == 'dy' || abr == 'st' || abr == 'ki' || abr == 'no';
	}

	/**
	 * Returns an array with the line length, angle, and number of sides of a regular polygon
	 *
	 * @private
	 * @param {Number} l side length
	 * @param {String} n name of the regular polygon
	 * @returns {Boolean} an array [line, angle, sides]
	 */
	function getRegularPolygon(l, n) {
		if (n == 'triangle') l = [l, -120, 3];
		else if (n == 'square') l = [l, -90, 4];
		else if (n == 'pentagon') l = [l, -72, 5];
		else if (n == 'hexagon') l = [l, -60, 6];
		else if (n == 'septagon') l = [l, -51.4285714286, 7];
		else if (n == 'octagon') l = [l, -45, 8];
		else if (n == 'enneagon') l = [l, -40, 9];
		else if (n == 'decagon') l = [l, -36, 10];
		else if (n == 'hendecagon') l = [l, -32.7272727273, 11];
		else if (n == 'dodecagon') l = [l, -30, 12];
		return l;
	}

	let spriteProps = [
		'autoDraw',
		'autoUpdate',
		'bounciness',
		'collider',
		'color',
		'density',
		'd',
		'debug',
		'diameter',
		'direction',
		'drag',
		'dynamic',
		'friction',
		'fill',
		'h',
		'height',
		'heading',
		'isSuperFast',
		'kinematic',
		'layer',
		'life',
		'mass',
		'mirror',
		'offset',
		'pixelPerfect',
		'resetAnimationsOnChange',
		'rotation',
		'rotationDrag',
		'rotationLock',
		'rotationSpeed',
		'scale',
		'shape',
		'speed',
		'static',
		'stroke',
		'strokeWeight',
		'text',
		'textColor',
		'tileSize',
		'visible',
		'w',
		'width',
		'x',
		'y'
	];

	let eventTypes = {
		_collisions: ['_collides', '_colliding', '_collided'],
		_overlappers: ['_overlaps', '_overlapping', '_overlapped']
	};

	this.Sprite = class {
		/**
		 * <a href="https://p5play.org/learn/sprite.html">
		 * Look at the Sprite reference pages before reading these docs.
		 * </a>
		 *
		 * The Sprite constructor can be used in many different ways.
		 * Every sprite you create is added to the `allSprites`
		 * group and put on the top layer, in front of all
		 * previously created sprites.
		 *
		 * @param {Number} [x] - horizontal position of the sprite
		 * @param {Number} [y] - vertical position of the sprite
		 * @param {Number} [w] - width of the placeholder rectangle and of
		 * the collider until an image or new collider are set. *OR* If height is not
		 * set then this parameter becomes the diameter of the placeholder circle.
		 * @param {Number} [h] - height of the placeholder rectangle and of the collider
		 * until an image or new collider are set
		 * @param {String} [collider] - collider type is 'dynamic' by default, can be
		 * 'static', 'kinematic', or 'none'
		 * @example
		 *
		 * let sprite = new Sprite();
		 *
		 * let rectangle = new Sprite(x, y, width, height);
		 *
		 * let circle = new Sprite(x, y, diameter);
		 *
		 * let line = new Sprite(x, y, [length, angle]);
		 */
		constructor(x, y, w, h, collider) {
			this.p = pInst;

			/**
			 * Each sprite has a unique id number. Don't change it!
			 * Its useful for debugging. Sprite id numbers start at 1000.
			 *
			 * @type {Number}
			 */
			this.idNum;

			let args = [...arguments];

			let group, ani;

			if (args[0] !== undefined && args[0] instanceof this.p.Group) {
				group = args[0];
				args = args.slice(1);
			}

			if (!args.length) this._noArgs = true;

			if (
				args[0] !== undefined &&
				isNaN(args[0]) &&
				(typeof args[0] == 'string' || args[0] instanceof this.p.SpriteAnimation || args[0] instanceof p5.Image)
			) {
				// shift
				ani = args[0];
				args = args.slice(1);
			}

			if (args.length == 1 && typeof args[0] == 'number') {
				throw new FriendlyError('Sprite', 0, [args[0]]);
			}

			x = args[0];
			y = args[1];
			w = args[2];
			h = args[3];
			collider = args[4];
			this._originMode = 'center';

			if (Array.isArray(x)) {
				x = undefined;
				y = undefined;
				w = args[0];
				h = args[1];
				collider = args[2];
			}

			// if (w is chain array) or (diameter/side length and h is a
			// collider type or the name of a regular polygon)
			if (Array.isArray(w) || typeof h == 'string') {
				if (!isNaN(w)) w = Number(w);
				if (typeof w != 'number' && Array.isArray(w[0])) {
					this._originMode = 'start';
				}
				if (h !== undefined) {
					if (Array.isArray(h)) {
						throw new FriendlyError('Sprite', 1, [`[[${w}], [${h}]]`]);
					}
					if (isColliderType(h)) {
						collider = h;
					} else {
						w = getRegularPolygon(w, h);
					}
					h = undefined;
				}
			} else if (isNaN(w)) {
				collider = w;
				w = undefined;
			}

			this.idNum = this.p.p5play.spritesCreated;
			this._uid = 1000 + this.idNum;
			this.p.p5play.sprites[this._uid] = this;
			this.p.p5play.spritesCreated++;

			/**
			 * Groups the sprite belongs to, including allSprites
			 *
			 * @type {Array}
			 * @default [allSprites]
			 */
			this.groups = [];
			this.p.allSprites.push(this);

			/**
			 * Keys are the animation label, values are SpriteAnimation objects.
			 *
			 * @type {SpriteAnimations}
			 */
			this.animations = new this.p.SpriteAnimations();

			/**
			 * True if the sprite was removed from the world
			 *
			 * @type {Boolean}
			 * @default false
			 */
			this.removed = false;

			if (group) {
				group.push(this);
				if (!ani) {
					for (let _ani in group.animations) {
						ani = _ani;
						break;
					}
				}
			} else {
				group = this.p.allSprites;
			}

			if (group.dynamic) collider ??= 'dynamic';
			if (group.kinematic) collider ??= 'kinematic';
			if (group.static) collider ??= 'static';
			collider ??= group.collider;

			this._shape = group.shape;

			/**
			 * Cycles before self removal.
			 * Set it to initiate a countdown, every draw cycle the property is
			 * reduced by 1 unit. If less than or equal to 0, this sprite will be removed.
			 *
			 * @type {Number}
			 * @default 100000000
			 */
			this.life = 100000000;

			/**
			 * The sprite's visibility.
			 *
			 * @type {Boolean}
			 * @default true
			 */
			this.visible = true;

			this._aniChangeCount = 0;

			/**
			 * Contains all the collision callback functions for this sprite
			 * when it comes in contact with other sprites or groups.
			 */
			this._collides = {};
			this._colliding = {};
			this._collided = {};

			this._overlap = {};
			/**
			 * Contains all the overlap callback functions for this sprite
			 * when it comes in contact with other sprites or groups.
			 */
			this._overlaps = {};
			this._overlapping = {};
			this._overlapped = {};

			this._collisions = {};
			this._overlappers = {};

			/**
			 * The tile size is used to change the size of one unit of
			 * measurement for the sprite.
			 *
			 * For example, if the tile size is 16, then a sprite with
			 * x=1 and y=1 will be drawn at position (16, 16) on the canvas.
			 *
			 * @type {Number}
			 * @default 1
			 */
			this.tileSize = group.tileSize || 1;

			let _this = this;

			// this.x and this.y are getters and setters that change this._pos internally
			// this.pos and this.position get this._position
			this._position = {
				x: 0,
				y: 0
			};

			this._pos = pInst.createVector.call(pInst);

			Object.defineProperty(this._pos, 'x', {
				get() {
					if (!_this.body) return _this._position.x;
					let x = (_this.body.getPosition().x / _this.tileSize) * plScale;
					return fixRound(x);
				},
				set(val) {
					if (_this.body) {
						let pos = new pl.Vec2((val * _this.tileSize) / plScale, _this.body.getPosition().y);
						_this.body.setPosition(pos);
					}
					_this._position.x = val;
				}
			});

			Object.defineProperty(this._pos, 'y', {
				get() {
					if (!_this.body) return _this._position.y;
					let y = (_this.body.getPosition().y / _this.tileSize) * plScale;
					return fixRound(y);
				},
				set(val) {
					if (_this.body) {
						let pos = new pl.Vec2(_this.body.getPosition().x, (val * _this.tileSize) / plScale);
						_this.body.setPosition(pos);
					}
					_this._position.y = val;
				}
			});

			// this._vel is used if the Sprite has no physics body
			this._velocity = {
				x: 0,
				y: 0
			};

			// this._vel extends p5.Vector
			this._vel = pInst.createVector.call(pInst);

			Object.defineProperties(this._vel, {
				x: {
					get() {
						let val;
						if (_this.body) val = _this.body.getLinearVelocity().x;
						else val = _this._velocity.x;
						return fixRound(val / _this.tileSize);
					},
					set(val) {
						val *= _this.tileSize;
						if (_this.body) {
							_this.body.setLinearVelocity(new pl.Vec2(val, _this.body.getLinearVelocity().y));
						} else {
							_this._velocity.x = val;
						}
					}
				},
				y: {
					get() {
						let val;
						if (_this.body) val = _this.body.getLinearVelocity().y;
						else val = _this._velocity.y;
						return fixRound(val / _this.tileSize);
					},
					set(val) {
						val *= _this.tileSize;
						if (_this.body) {
							_this.body.setLinearVelocity(new pl.Vec2(_this.body.getLinearVelocity().x, val));
						} else {
							_this._velocity.y = val;
						}
					}
				}
			});

			this._mirror = {
				_x: 1,
				_y: 1,
				get x() {
					return this._x < 0;
				},
				set x(val) {
					this._x = val ? -1 : 1;
				},
				get y() {
					return this._y < 0;
				},
				set y(val) {
					this._y = val ? -1 : 1;
				}
			};

			/**
			 * By default sprites are drawn in the order they were created in.
			 * You can change the draw order by editing sprite's layer
			 * property. Sprites with the highest layer value get drawn first.
			 *
			 * @type {Number}
			 */
			this.layer = group.layer;
			this.layer ??= this.p.allSprites._getTopLayer() + 1;
			collider ??= group.collider;

			if (!collider || typeof collider != 'string') {
				collider = 'dynamic';
			}
			this.collider = collider;

			x ??= group.x;
			if (x === undefined) {
				x = this.p.width / this.p.allSprites.tileSize / 2;
				this._vertexMode = true;
			}
			y ??= group.y;
			if (y === undefined) y = this.p.height / this.p.allSprites.tileSize / 2;
			w ??= group.w || group.width || group.d || group.diameter;
			h ??= group.h || group.height;

			if (typeof x == 'function') x = x(group.length - 1);
			if (typeof y == 'function') y = y(group.length - 1);

			this.x = x;
			this.y = y;

			if (ani) {
				if (ani instanceof p5.Image) {
					this.addAni(ani);
				} else {
					if (typeof ani == 'string') this._changeAni(ani);
					else this._ani = ani.clone();
				}
				let ts = this.tileSize;
				if (!w && (this._ani.w != 1 || this._ani.h != 1)) {
					w = this._ani.w / ts;
					if (this.shape != 'circle') {
						h = this._ani.h / ts;
					}
				}
			}

			this.mouse = new this.p._SpriteMouse();

			if (this.collider != 'none') {
				if (this._vertexMode) this.addCollider(w, h);
				else this.addCollider(0, 0, w, h);
			} else {
				this.w = w || (this.tileSize > 1 ? 1 : 50);
				this.h = h || this.w;
				if (w !== undefined && h === undefined) this._shape = 'circle';
				else this._shape = 'box';
			}

			this._scale = new Scale();

			Object.defineProperty(this._scale, 'x', {
				get() {
					return this._x;
				},
				set(val) {
					if (val == this._x) return;
					let scalarX = val / this._x;
					_this._w *= scalarX;
					_this._hw *= scalarX;
					_this._resizeCollider({ x: scalarX, y: 1 });
					this._x = val;
					this._avg = (this._x + this._y) * 0.5;
				}
			});

			Object.defineProperty(this._scale, 'y', {
				get() {
					return this._y;
				},
				set(val) {
					if (val == this._y) return;
					let scalarY = val / this._y;
					if (_this._h) {
						this._h *= scalarY;
						this._hh *= scalarY;
					}
					_this._resizeCollider({ x: 1, y: scalarY });
					this._y = val;
					this._avg = (this._x + this._y) * 0.5;
				}
			});

			this._offset = {
				_x: 0,
				_y: 0,
				get x() {
					return this._x;
				},
				set x(val) {
					if (val == this._x) return;
					_this._offsetCenterBy(val - this._x, 0);
				},
				get y() {
					return this._y;
				},
				set y(val) {
					if (val == this._y) return;
					_this._offsetCenterBy(0, val - this._y);
				}
			};

			/**
			 * The sprite's position on the previous frame.
			 *
			 * @type {object}
			 */
			this.prevPos = { x, y };

			this._dest = { x, y };
			this._destIdx = 0;
			this.drag = 0;

			/**
			 * When the sprite.debug property is set to true, the collider
			 * shapes will be drawn as bright green outlines with crosshairs
			 * at the center of the sprite.
			 *
			 * When the sprite.debug property is set to 'colliders', only the
			 * collider shapes will be drawn.
			 *
			 * @type {boolean|string}
			 * @default false
			 */
			this.debug = false;

			this._shift = {};

			let gvx = group.vel.x || 0;
			let gvy = group.vel.y || 0;
			if (typeof gvx == 'function') gvx = gvx(group.length - 1);
			if (typeof gvy == 'function') gvy = gvy(group.length - 1);
			this.vel.x = gvx;
			this.vel.y = gvy;

			/**
			 * autoDraw is a property of all groups that controls whether
			 * a group is automatically drawn to the screen after the end
			 * of each draw cycle.
			 *
			 * It only needs to be set to false once and then it will
			 * remain false for the rest of the sketch, unless changed.
			 *
			 * @type {Boolean}
			 * @default true
			 */
			/**
			 * autoUpdate is a property of all groups that controls whether
			 * a group is automatically updated after the end of each draw
			 * cycle.
			 *
			 * It only needs to be set to false once and then it will
			 * remain false for the rest of the sketch, unless changed.
			 *
			 * @type {Boolean}
			 * @default true
			 */
			/**
			 * If false, animations will always start playing from the frame
			 * they were stopped at. If true, when the sprite changes the
			 * animation its currently displaying, it will start playing
			 * from frame 0.
			 *
			 * @type {SpriteAnimation}
			 * @default false
			 */

			for (let prop of spriteProps) {
				if (prop == 'collider' || prop == 'x' || prop == 'y') continue;
				let val = group[prop];
				if (val === undefined) continue;
				if (typeof val == 'function') val = val(group.length - 1);
				if (typeof val == 'object') {
					this[prop] = Object.assign({}, val);
				} else {
					this[prop] = val;
				}
			}

			// ignore these properties
			let ignoreProps = [
				'collider',
				'idNum',
				'p',
				'parent',
				'length',
				'_collides',
				'_colliding',
				'_collided',
				'_collisions',
				'_overlap',
				'_overlaps',
				'_overlapping',
				'_overlapped',
				'_overlappers',
				'animation',
				'animations',
				'autoCull',
				'Sprite',
				'GroupSprite',
				'Group',
				'Subgroup',
				'subgroups',
				'vel',
				'mouse'
			];

			// the sprite should also inherit
			// custom group properties, "group traits"
			for (let g of this.groups) {
				let props = Object.keys(g);
				for (let prop of props) {
					if (!isNaN(prop) || prop[0] == '_' || ignoreProps.includes(prop)) {
						continue;
					}
					let val = g[prop];
					if (val === undefined) continue;
					if (typeof val == 'function') {
						if (isArrowFunction(val)) val = val();
					}
					if (typeof val == 'object') {
						this[prop] = Object.assign({}, val);
					} else {
						this[prop] = val;
					}
				}
			}

			/**
			 * @type {Number}
			 * @default undefined
			 */
			this.strokeWeight;

			this.color ??= this.p.color(this.p.random(30, 245), this.p.random(30, 245), this.p.random(30, 245));

			this.textColor ??= this.p.color(0);
			this.textSize ??= this.tileSize == 1 ? (this.p.canvas ? this.p.textSize() : 12) : 0.8;

			let shouldCreateSensor = false;
			for (let g of this.groups) {
				if (g._hasSensors) {
					shouldCreateSensor = true;
					break;
				}
			}
			if (shouldCreateSensor && !this._hasSensors) this.addDefaultSensors();

			this._massUndefinedByUser = true;
			if (w === undefined && h === undefined) {
				this._dimensionsUndefinedByUser = true;
			}
		}

		/**
		 * Adds a collider (fixture) to the sprite's physics body.
		 *
		 * It accepts parameters in a similar format to the Sprite
		 * constructor except the first two parameters are x and y offsets,
		 * the distance new collider should be from the center of the sprite.
		 *
		 * One limitation of the current implementation is that the collider
		 * type can't be changed without losing every collider added to the
		 * sprite besides the first. This will be fixed in a future release.
		 *
		 * @param {Number} offsetX distance from the center of the sprite
		 * @param {Number} offsetY distance from the center of the sprite
		 * @param {Number} w width of the collider
		 * @param {Number} h height of the collider
		 */
		addCollider(offsetX, offsetY, w, h) {
			let props = {};
			props.shape = this._parseShape(...arguments);
			if (props.shape.m_type == 'chain') {
				props.density = 0;
				props.restitution = 0;
			}
			props.density ??= this.density || 5;
			props.friction ??= this.friction || 0.5;
			props.restitution ??= this.bounciness || 0.2;

			if (!this.body) {
				this.body = this.p.world.createBody({
					position: scaleTo(this.x, this.y, this.tileSize),
					type: this.collider
				});
				this.body.sprite = this;
			}
			this.body.createFixture(props);
		}

		/**
		 * Adds a sensor to the sprite's physics body that's used to detect
		 * overlaps with other sprites.
		 *
		 * It accepts parameters in a similar format to the Sprite
		 * constructor except the first two parameters are x and y offsets,
		 * the relative distance the new sensor should be from the center of
		 * the sprite.
		 *
		 * @param {Number} offsetX distance from the center of the sprite
		 * @param {Number} offsetY distance from the center of the sprite
		 * @param {Number} w width of the collider
		 * @param {Number} h height of the collider
		 */
		addSensor(offsetX, offsetY, w, h) {
			let s = this._parseShape(...arguments);
			if (!this.body) {
				this.body = this.p.world.createBody({
					position: scaleTo(this.x, this.y, this.tileSize),
					type: 'dynamic'
				});
				this.body.sprite = this;
			}
			this.body.createFixture({
				shape: s,
				isSensor: true
			});
			this._hasSensors = true;
		}

		_parseShape(offsetX, offsetY, w, h) {
			let args = [...arguments];
			let path, shape;

			if (args.length < 3) {
				offsetX = 0;
				offsetY = 0;
				w = args[0];
				h = args[1];
				this._vertexMode = true;
			}

			offsetX ??= 0;
			offsetY ??= 0;
			w ??= this._w;
			if (!this.body && this.shape && this.shape != 'circle') {
				h ??= this._h;
			}

			// if (w is chain array) or (diameter/side length and h is a
			// collider type or the name of a regular polygon)
			if (Array.isArray(w) || typeof h == 'string') {
				if (!isNaN(w)) w = Number(w);
				if (typeof w != 'number' && Array.isArray(w[0])) {
					this._originMode = 'start';
				}
				if (typeof h == 'string') {
					path = getRegularPolygon(w, h);
					h = undefined;
				} else {
					path = w;
				}
			} else {
				if (w !== undefined && h === undefined) shape ??= 'circle';
				shape ??= 'box';
			}

			if (shape == 'box' || shape == 'circle') {
				w ??= this.tileSize > 1 ? 1 : 50;
				h ??= w;
			}

			let dimensions;

			// the actual dimensions of the collider for a box or circle are a
			// little bit smaller so that they can slid past each other
			// when in a tile grid
			if (shape == 'box' || shape == 'circle') {
				dimensions = scaleTo(w - 0.08, h - 0.08, this.tileSize);
			}

			let s;
			if (shape == 'box') {
				s = pl.Box(dimensions.x / 2, dimensions.y / 2, scaleTo(offsetX, offsetY, this.tileSize), 0);
			} else if (shape == 'circle') {
				s = pl.Circle(scaleTo(offsetX, offsetY, this.tileSize), dimensions.x / 2);
			} else if (path) {
				let vecs = [{ x: 0, y: 0 }];
				let vert = { x: 0, y: 0 };
				let min = { x: 0, y: 0 };
				let max = { x: 0, y: 0 };

				// if the path is an array of position arrays
				let usesVertices = Array.isArray(path[0]);

				function checkVert() {
					if (vert.x < min.x) min.x = vert.x;
					if (vert.y < min.y) min.y = vert.y;
					if (vert.x > max.x) max.x = vert.x;
					if (vert.y > max.y) max.y = vert.y;
				}

				let x, y;
				if (usesVertices) {
					if (this._vertexMode) {
						x = path[0][0];
						y = path[0][1];
						// log(x, y);
						if (!this.body) {
							this.x = x;
							this.y = y;
						} else {
							x = this.x - this._relativeOrigin.x;
							y = this.y - this._relativeOrigin.y;
							vecs.pop();
						}
					}
					for (let i = 0; i < path.length; i++) {
						if (this._vertexMode) {
							if (i == 0 && !this.body) continue;
							// verts are relative to the first vert
							vert.x = path[i][0] - x;
							vert.y = path[i][1] - y;
						} else {
							vert.x += path[i][0];
							vert.y += path[i][1];
						}
						vecs.push({ x: vert.x, y: vert.y });

						checkVert();
					}
				} else {
					let rep = 1;
					if (path.length % 2) rep = path[path.length - 1];
					let mod = rep > 0 ? 1 : -1;
					rep = Math.abs(rep);
					let ang = 0;
					for (let i = 0; i < rep; i++) {
						for (let j = 0; j < path.length - 1; j += 2) {
							let len = path[j];
							ang += path[j + 1];
							vert.x += len * this.p.cos(ang);
							vert.y += len * this.p.sin(ang);
							vecs.push({ x: vert.x, y: vert.y });

							checkVert();
						}
						ang *= mod;
					}
				}

				if (
					Math.abs(Math.abs(vecs[0].x) - Math.abs(vecs[vecs.length - 1].x)) <= pl.Settings.linearSlop &&
					Math.abs(Math.abs(vecs[0].y) - Math.abs(vecs[vecs.length - 1].y)) <= pl.Settings.linearSlop
				) {
					shape = 'polygon';
					this._originMode = 'center';
				} else {
					shape = 'chain';
				}

				w = max.x - min.x;
				this._hw = w * 0.5;
				h = max.y - min.y;
				this._hh = h * 0.5;

				let isConvex = false;
				if (shape == 'polygon' && this._isConvexPoly(vecs.slice(0, -1))) {
					isConvex = true;
				}

				if (this._originMode == 'start') {
					for (let i = 0; i < vecs.length; i++) {
						vecs[i] = scaleTo(vecs[i].x, vecs[i].y, this.tileSize);
					}
				} else {
					// the center relative to the first vertex
					let centerX = 0;
					let centerY = 0;
					// use centroid of a triangle method to get center
					// average of all vertices
					let sumX = 0;
					let sumY = 0;

					let vl = vecs.length;
					// last vertex is same as first
					if (shape == 'polygon' || isConvex) vl--;
					for (let i = 0; i < vl; i++) {
						sumX += vecs[i].x;
						sumY += vecs[i].y;
					}
					centerX = sumX / vl;
					centerY = sumY / vl;

					if (!this.body) {
						this._relativeOrigin = { x: centerX, y: centerY };
					}

					// use bounding box method to get center
					// not how planck does it!
					// centerX = this._hw - min.x;
					// centerY = this._hh - min.y;

					if (this._vertexMode && usesVertices) {
						if (!this.body) {
							// repositions the sprite's x, y coordinates
							// to be in the center of the shape
							this.x += centerX;
							this.y += centerY;
						} else {
							centerX = this._relativeOrigin.x;
							centerY = this._relativeOrigin.y;
						}
					}

					for (let i = 0; i < vecs.length; i++) {
						let vec = vecs[i];
						vecs[i] = scaleTo(vec.x + offsetX - centerX, vec.y + offsetY - centerY, this.tileSize);
					}
				}

				if (!isConvex || vecs.length - 1 > pl.Settings.maxPolygonVertices || this._shape == 'chain') {
					shape = 'chain';
				}

				if (shape == 'polygon') {
					s = pl.Polygon(vecs);
				} else if (shape == 'chain') {
					s = pl.Chain(vecs, false);
				}
			}
			if (!this._shape) {
				this._shape = shape;
			}
			this._w = w;
			this._hw = w * 0.5;

			if (this._shape == 'circle') {
				this._diameter = w;
			} else {
				this._h = h;
				this._hh = h * 0.5;
			}
			return s;
		}

		/**
		 * Removes the physics body colliders from the sprite but not
		 * overlap sensors.
		 *
		 * Only use this method if you never want to use the sprite's
		 * colliders again. If you want to disable colliders without
		 * removing them, use the overlaps, overlapping, or overlapped
		 * functions instead.
		 *
		 */
		removeColliders() {
			this._collides = {};
			this._colliding = {};
			this._collided = {};
			this._removeFixtures(false);
		}

		addJoint(spriteB, type, props) {
			let spriteA = this;
			props ??= {};
			/*
			 * frequencyHz, dampingRatio, collideConnected, userData, ratio,
			 * enableLimit, enableMotor, lowerAngle, maxMotorTorque
			 * maxMotorForce, motorSpeed, referenceAngle, upperAngle, maxForce
			 * maxTorque, localAxisA, angularOffset, joint1, joint2,
			 * correctionFactor
			 */
			if (props.motorSpeed) props.enableMotor = true;

			// function genProps(a, b) {
			props = Object.assign(props, {
				bodyA: spriteA.body,
				bodyB: spriteB.body,
				length: props.length != undefined ? scaleXTo(props.length) : null,
				maxLength: props.maxLength != undefined ? scaleXTo(props.maxLength) : null,
				lengthA: props.lengthA != undefined ? scaleXTo(props.lengthA) : null,
				lengthB: props.lengthB != undefined ? scaleXTo(props.lengthB) : null,
				groundAnchorA: props.groundAnchorA ? scaleXTo(props.groundAnchorA) : new pl.Vec2(0, 0),
				groundAnchorB: props.groundAnchorB ? scaleXTo(props.groundAnchorB) : new pl.Vec2(0, 0),
				upperTranslation: props.upperTranslation ? scaleXTo(props.upperTranslation) : 1,
				lowerTranslation: props.lowerTranslation ? scaleXTo(props.lowerTranslation) : 1,
				linearOffset: props.linearOffset ? scaleTo(props.linearOffset) : new pl.Vec2(0, 0)
			});
			if (props.anchorA) {
				props.localAnchorA = scaleTo(props.anchorA);
			} else if (props.localAnchorA) {
				props.localAnchorA = scaleTo(props.localAnchorA);
			} else {
				props.localAnchorA = new pl.Vec2(0, 0);
			}
			if (props.anchorB) {
				props.localAnchorB = scaleTo(props.anchorB);
			} else if (props.localAnchorB) {
				props.localAnchorB = scaleTo(props.localAnchorB);
			} else {
				props.localAnchorB = new pl.Vec2(0, 0);
			}
			// 	return props;
			// }

			type ??= 'distance';
			let j;
			if (type == 'distance') {
				j = pl.DistanceJoint(props);
			} else if (type == 'orbit') {
				// let s = new Sprite([
				// 	[spriteA.x, spriteA.y],
				// 	[spriteB.x, spriteB.y]
				// ]);
				// s.overlaps(allSprites);
				// j = pl.DistanceJoint(genProps(spriteA, s));
				// this.p.world.createJoint(j);
				// genProps(s, spriteB);
				// j = pl.RevoluteJoint(props, s.body, spriteB.body, spriteB.body.getWorldCenter());
			} else if (type == 'pulley') {
				j = pl.PulleyJoint(props);
			} else if (type == 'wheel') {
				j = pl.WheelJoint(props);
			} else if (type == 'rope') {
				j = pl.RopeJoint(props);
			} else if (type == 'weld') {
				j = pl.WeldJoint(props);
			} else if (type == 'revolute') {
				j = pl.RevoluteJoint(props, spriteA.body, spriteB.body, spriteA.body.getWorldCenter());
			} else if (type == 'gear') {
				j = pl.GearJoint(props);
			} else if (type == 'friction') {
				j = pl.FrictionJoint(props);
			} else if (type == 'motor') {
				j = pl.MotorJoint(props);
			} else if (type == 'prismatic') {
				j = pl.PrismaticJoint(props);
			} else if (type == 'mouse') {
				/*j = new box2d.b2MouseJointDef();
        j.bodyA = bodyA!=null?bodyA.body:b2world.CreateBody(new box2d.b2BodyDef());
        j.bodyB = bodyB.body;
        j.target = b2scaleTo(props.xy);
        j.collideConnected = true;
        j.maxForce = props.maxForce||(1000.0 * bodyB.body.GetMass());
        j.frequencyHz = props.frequency||5;  // Try a value less than 5 (0 for no elasticity)
        j.dampingRatio = props.damping||0.9; // Ranges between 0 and 1 (1 for no springiness)
        bodyB.body.SetAwake(true);
        bodyA=bodyB;*/
			}
			return this.p.world.createJoint(j);
		}

		/**
		 * Removes overlap sensors from the sprite.
		 *
		 * Only use this method if you never want to use the sprite's
		 * overlap sensors again. To disable overlap sensors without
		 * removing them, use the collides, colliding, or collided functions
		 * instead.
		 *
		 */
		removeSensors() {
			this._overlap = {};
			this._overlaps = {};
			this._overlapping = {};
			this._overlapped = {};
			this._removeFixtures(true);
		}

		// removes sensors or colliders or both
		_removeFixtures(removeSensors) {
			let prevFxt;
			for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
				if (removeSensors === undefined || fxt.m_isSensor == removeSensors) {
					let _fxt = fxt.m_next;
					fxt.destroyProxies(this.p.world.m_broadPhase);
					if (!prevFxt) {
						this.body.m_fixtureList = _fxt;
					} else {
						prevFxt.m_next = _fxt;
					}
				} else {
					prevFxt = fxt;
				}
			}
		}

		_offsetCenterBy(x, y) {
			this._offset._x += x;
			this._offset._y += y;

			if (!this.body) return;

			let off = scaleTo(x, y, this.tileSize);
			for (let fxt = this.body.m_fixtureList; fxt; fxt = fxt.m_next) {
				let shape = fxt.m_shape;
				if (shape.m_type != 'circle') {
					let vertices = shape.m_vertices;
					for (let v of vertices) {
						v.x += off.x;
						v.y += off.y;
					}
				} else {
					shape.m_p.x += off.x;
					shape.m_p.y += off.y;
				}
			}
		}

		/**
		 * Clones the collider's props to be transferred to a new collider.
		 * @private
		 */
		_cloneBodyProps() {
			let body = {};
			let props = [
				'bounciness',
				'density',
				'drag',
				'friction',
				'heading',
				'isSuperFast',
				'rotation',
				'rotationDrag',
				'rotationLock',
				'rotationSpeed',
				'scale',
				'vel',
				'x',
				'y'
			];
			if (!this._massUndefinedByUser || !this._dimensionsUndefinedByUser) {
				props.push('mass');
			}
			for (let prop of props) {
				if (typeof this[prop] == 'object') {
					body[prop] = Object.assign({}, this[prop]);
				} else {
					body[prop] = this[prop];
				}
			}
			return body;
		}

		// get aabb() {
		// 	return getAABB(this);
		// }

		// set advance(val) {
		// 	this.body.advance(val);
		// }
		// set angularImpulse(val) {
		// 	this.body.applyAngularImpulse(val, true);
		// }

		/**
		 * This property disables the ability for a sprite to "sleep".
		 *
		 * "Sleeping" sprites are not included in the physics simulation, a
		 * sprite starts "sleeping" when it stops moving and doesn't collide
		 * with anything that it wasn't already _touching.
		 *
		 * @type {Boolean}
		 * @default true
		 */
		get allowSleeping() {
			return this.body.getSleepingAllowed();
		}

		set allowSleeping(val) {
			this.body.setSleepingAllowed(val);
		}

		/**
		 * Reference to the sprite's current animation.
		 *
		 * @type {SpriteAnimation}
		 */
		get animation() {
			return this._ani;
		}
		set animation(val) {
			this.changeAni(val);
		}

		get ani() {
			return this._ani;
		}
		set ani(val) {
			this.changeAni(val);
		}

		get anis() {
			return this.animations;
		}

		/**
		 * The bounciness of the sprite's physics body.
		 *
		 * @type {Number}
		 * @default 0.2
		 */
		get bounciness() {
			if (!this.fixture) return;
			return this.fixture.getRestitution();
		}
		set bounciness(val) {
			for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
				fxt.setRestitution(val);
			}
		}

		/**
		 * The center of mass of the sprite's physics body.
		 *
		 * @type {Number}
		 */
		get centerOfMass() {
			let center = this.body.getWorldCenter();
			return scaleFrom(center.x, center.y, this.tileSize);
		}

		/**
		 * The sprite's collider type. Default is 'dynamic'.
		 *
		 * The collider type can be one of the following strings:
		 * 'dynamic', 'static', 'kinematic', 'none'.
		 *
		 * @type {String}
		 * @default 'dynamic'
		 */
		get collider() {
			return this._collider;
		}
		set collider(val) {
			val = val.toLowerCase();
			let c = val[0];
			if (c == 'd') val = 'dynamic';
			if (c == 's') val = 'static';
			if (c == 'k') val = 'kinematic';
			if (c == 'n') val = 'none';

			if (val == this._collider) return;

			this.__collider = ['d', 's', 'k', 'n'].indexOf(c);

			if (this._collider === undefined) {
				this._collider = val;
				return;
			}

			let oldCollider = this._collider;

			this._collider = val;
			if (oldCollider !== undefined) this._reset();
		}

		_reset() {
			let bodyProps = this._cloneBodyProps();

			let v;
			if (this._shape == 'chain' || this._shape == 'polygon') {
				v = this._getVertices(true);
				this._vertexMode = true;
			}

			// remove body
			if (this.body) {
				this.p.world.destroyBody(this.body);
				this.body = undefined;
			}

			// replace colliders and overlap sensors
			if (this._collider != 'none') {
				if (v) {
					this.addCollider(0, 0, v);
				} else {
					this.addCollider();
				}
				if (this._hasSensors) {
					this.addDefaultSensors();
				}
			}
			for (let prop in bodyProps) {
				if (bodyProps[prop] !== undefined) {
					this[prop] = bodyProps[prop];
				}
			}
		}

		_parseColor(val) {
			// false if object was copied with Object.assign
			if (val instanceof p5.Color) {
				return val;
			} else if (typeof val != 'object') {
				if (typeof val == 'string' && val.length == 1) {
					return this.p.colorPal(val);
				} else {
					return this.p.color(val);
				}
			}
			if (val.levels) return this.p.color(...val.levels);
			// support for Q5.Color
			if (val._r !== undefined) return this.p.color(val._r, val._g, val._b, val._a * 255);
			if (val._h !== undefined) return this.p.color(val._h, val._s, val._v, val._a * 255);
			throw new Error('Invalid color');
		}

		/**
		 * The sprite's current color. By default sprites get a random color.
		 *
		 * @type {p5.Color}
		 * @default random color
		 */
		get color() {
			return this._color;
		}
		set color(val) {
			this._color = this._parseColor(val);
		}
		/**
		 * Alias for color. colour is the British English spelling.
		 *
		 * @type {p5.Color}
		 * @default random color
		 */
		get colour() {
			return this._color;
		}
		set colour(val) {
			this._color = this._parseColor(val);
		}
		/**
		 * @deprecated
		 */
		get shapeColor() {
			console.warn('sprite.shapeColor is deprecated, use sprite.color instead');
			return this._color;
		}
		set shapeColor(val) {
			console.warn('sprite.shapeColor is deprecated, use sprite.color instead');
			this.color = val;
		}

		/**
		 * Alias for sprite.fillColor
		 *
		 * @type {p5.Color}
		 * @default random color
		 */
		get fill() {
			return this._color;
		}
		set fill(val) {
			this._color = this._parseColor(val);
		}

		/**
		 * Alias for sprite.color
		 *
		 * @type {p5.Color}
		 * @default random color
		 */
		get fillColor() {
			return this._color;
		}
		set fillColor(val) {
			this._color = this._parseColor(val);
		}

		/**
		 * Alias for sprite.strokeColor
		 *
		 * @type {p5.Color}
		 */
		get stroke() {
			return this._stroke;
		}
		set stroke(val) {
			this._stroke = this._parseColor(val);
		}

		/**
		 * The sprite's stroke current color. By default the stroke of a sprite
		 * indicates its collider type.
		 *
		 * @type {p5.Color}
		 */
		get strokeColor() {
			return this._stroke;
		}
		set strokeColor(val) {
			this._stroke = this._parseColor(val);
		}

		/**
		 * The sprite's current text color. Black by default.
		 *
		 * @type {p5.Color}
		 * @default black (#000000)
		 */
		get textColor() {
			return this._textColor;
		}
		set textColor(val) {
			this._textColor = this._parseColor(val);
		}

		/**
		 * The density of the sprite's physics body.
		 *
		 * @type {Number}
		 */
		get density() {
			if (!this.fixture) return;
			return this.fixture.getDensity();
		}
		set density(val) {
			for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
				fxt.setDensity(val);
			}
		}

		/**
		 * Use .layer instead.
		 *
		 * @deprecated depth
		 */
		get depth() {
			console.warn('sprite.depth is deprecated, use sprite.layer instead');
			return this.layer;
		}
		set depth(val) {
			console.warn('sprite.depth is deprecated, use sprite.layer instead');
			this.layer = val;
		}

		/**
		 * The angle of the sprite's movement or it's rotation angle if the
		 * sprite is not moving.
		 *
		 * @type {Number}
		 * @default 0 ("right")
		 */
		get direction() {
			if (this.body && (this.vel.x !== 0 || this.vel.y !== 0)) {
				return this.p.atan2(this.vel.y, this.vel.x);
			}
			if (!this._direction) return this.rotation;
			return this._direction;
		}
		set direction(val) {
			if (typeof val == 'string') {
				this._heading = val;

				let dir = val.toLowerCase().replaceAll(/[ _-]/g, '');
				let dirs = {
					up: -90,
					down: 90,
					left: 180,
					right: 0,
					upright: -45,
					rightup: -45,
					upleft: -135,
					leftup: -135,
					downright: 45,
					rightdown: 45,
					downleft: 135,
					leftdown: 135,
					forward: this.rotation,
					backward: this.rotation + 180
				};
				val = dirs[dir];
			}

			this._direction = val;
			let speed = this.speed;
			this.vel.x = this.p.cos(val) * speed;
			this.vel.y = this.p.sin(val) * speed;
		}

		/**
		 * The amount of resistance a sprite has to being moved.
		 *
		 * @type {Number}
		 * @default 0
		 */
		get drag() {
			if (this.body) return this.body.getLinearDamping();
			else return undefined;
		}
		set drag(val) {
			if (this.body) this.body.setLinearDamping(val);
		}

		/**
		 * Displays the sprite.
		 *
		 * This function is called automatically at
		 * the end of each p5.js draw function call but it can also be run
		 * separately to customize the order sprites are drawn in relation
		 * to other stuff drawn to the p5.js canvas. Also see the sprite.layer
		 * property.
		 *
		 * A sprite's draw function can be overridden with a
		 * custom draw function, in which the center of the sprite is
		 * at (0, 0).
		 *
		 * @example
		 * sprite.draw = function() {
		 *   // an oval
		 *   ellipse(0,0,20,10);
		 * }
		 *
		 */
		get draw() {
			return this._display;
		}

		set draw(val) {
			this._draw = val;
		}

		/**
		 * True if the sprite's physics body is dynamic.
		 *
		 * @type {Boolean}
		 * @default true
		 */
		get dynamic() {
			if (!this.body) return undefined;
			return this.body.isDynamic();
		}
		set dynamic(val) {
			if (val) this.collider = 'dynamic';
			else this.collider = 'kinematic';
		}

		/**
		 * If true the sprite can not rotate.
		 *
		 * @type {Boolean}
		 * @default false
		 */
		get rotationLock() {
			if (!this.body) return undefined;
			return this.body.isFixedRotation();
		}
		set rotationLock(val) {
			if (this.body) this.body.setFixedRotation(val);
		}

		/**
		 * Returns the first node in a linked list of the planck physics
		 * body's fixtures.
		 */
		get fixture() {
			return this.fixtureList;
		}
		/**
		 * Returns the first node in a linked list of the planck physics
		 * body's fixtures.
		 */
		get fixtureList() {
			if (!this.body) return null;
			return this.body.m_fixtureList;
		}

		/**
		 * The amount the sprite's physics body resists moving
		 * when rubbing against another physics body.
		 *
		 * @type {Number}
		 * @default 0.5
		 */
		get friction() {
			if (!this.fixture) return;
			return this.fixture.getFriction();
		}
		set friction(val) {
			for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
				fxt.setFriction(val);
			}
		}

		/**
		 * The sprite's heading. This is a string that can be set to
		 * "up", "down", "left", "right", "upRight", "upLeft", "downRight"
		 *
		 * It ignores cardinal direction word order, capitalization, spaces,
		 * underscores, and dashes.
		 *
		 * @type {String}
		 * @default undefined
		 */
		get heading() {
			return this._heading;
		}
		set heading(val) {
			this.direction = val;
		}

		/**
		 * Use .static instead.
		 *
		 * @deprecated immovable
		 */
		get immovable() {
			console.warn('sprite.immovable is deprecated, use sprite.static instead');
			return this.body.isStatic();
		}
		set immovable(val) {
			console.warn('sprite.immovable is deprecated, use sprite.static instead');
			if (val) this.body.setStatic();
		}
		// get inertia() {
		// 	return this.body.getInertia();
		// }

		/**
		 * A reference to the sprite's current image.
		 *
		 * @type {p5.Image}
		 */
		get img() {
			return this._ani?.frameImage;
		}
		set img(val) {
			this.changeAni(val);
		}

		/**
		 * A reference to the sprite's current image.
		 *
		 * @type {p5.Image}
		 */
		get image() {
			return this._ani?.frameImage;
		}
		set image(val) {
			this.changeAni(val);
		}

		/**
		 * True if the sprite is moving.
		 *
		 * @type {Boolean}
		 * @readonly
		 */
		get isMoving() {
			return this.vel.x != 0 || this.vel.y != 0;
		}

		/**
		 * Set this to true if the sprite goes really fast to prevent
		 * inaccurate physics simulation.
		 *
		 * @type {Boolean}
		 * @default false
		 */
		get isSuperFast() {
			if (!this.body) return undefined;
			return this.body.isBullet();
		}
		set isSuperFast(val) {
			if (this.body) this.body.setBullet(val);
		}

		// get joint() {
		// 	return this.body.getJointList().joint;
		// }
		// get jointList() {
		// 	return this.body.getJointList();
		// }

		/**
		 * True if the sprite's physics body is kinematic.
		 *
		 * @type {Boolean}
		 * @default false
		 */
		get kinematic() {
			if (!this.body) return undefined;
			return this.body.isKinematic();
		}
		set kinematic(val) {
			if (val) this.collider = 'kinematic';
			else this.collider = 'dynamic';
		}
		/**
		 * The mass of the sprite's physics body.
		 *
		 * @type {Number}
		 */
		get mass() {
			if (!this.body) return undefined;
			return this.body.getMass();
		}
		set mass(val) {
			if (!this.body) return;
			let t = this.massData;
			t.mass = val;
			this.body.setMassData(t);
			delete this._massUndefinedByUser;
		}

		get massData() {
			const t = { I: 0, center: new pl.Vec2(0, 0), mass: 0 };
			this.body.getMassData(t);
			t.center = scaleFrom(t.center.x, t.center.y, this.tileSize);
			return t;
		}

		/**
		 * The sprite's mirror states.
		 *
		 * @type {Object}
		 * @property {Boolean} x - The sprite's horizontal mirror state.
		 * @property {Boolean} y - The sprite's vertical mirror state.
		 * @default {x: false, y: false}
		 */
		get mirror() {
			return this._mirror;
		}
		set mirror(val) {
			if (val.x !== undefined) this._mirror.x = val.x;
			if (val.y !== undefined) this._mirror.y = val.y;
		}

		/**
		 * Offsetting the sprite moves the sprite's physics body relative
		 * to its center.
		 *
		 * The sprite's x and y properties represent its center in world
		 * coordinates. This point is also the sprite's center of rotation.
		 *
		 * @type {object}
		 */
		get offset() {
			return this._offset;
		}
		set offset(val) {
			val.x ??= this._offset._x;
			val.y ??= this._offset._y;
			if (val.x == this._offset._x && val.y == this._offset._y) return;
			this._offsetCenterBy(val.x - this._offset._x, val.y - this._offset._y);
		}

		/**
		 * Verbose alias for sprite.prevPos
		 *
		 * @type {object}
		 */
		get previousPosition() {
			return this.prevPos;
		}
		set previousPosition(val) {
			this.prevPos = val;
		}

		/**
		 * The angle of the sprite's rotation, not the direction it is moving.
		 *
		 * @type {Number}
		 * @default 0
		 */
		get rotation() {
			if (!this.body) return this._angle || 0;
			if (this.p._angleMode === 'degrees') {
				return this.p.degrees(this.body.getAngle());
			}
			return this.body.getAngle();
		}
		set rotation(val) {
			if (this.body) {
				if (this.p._angleMode === 'degrees') {
					this.body.setAngle(this.p.radians(val));
				} else {
					this.body.setAngle(val);
				}
			} else {
				this._angle = val;
			}
		}
		/**
		 * The amount the sprite resists rotating.
		 *
		 * @type {Number}
		 * @default 0
		 */
		get rotationDrag() {
			if (!this.body) return undefined;
			return this.body.getAngularDamping();
		}
		set rotationDrag(val) {
			if (this.body) this.body.setAngularDamping(val);
		}
		/**
		 * The speed of the sprite's rotation.
		 *
		 * @type {Number}
		 * @default 0
		 */
		get rotationSpeed() {
			if (this.body) return this.body.getAngularVelocity();
			return this._rotationSpeed || 0;
		}
		set rotationSpeed(val) {
			if (this.body) this.body.setAngularVelocity(val);
			else this._rotationSpeed = val;
		}

		/**
		 * Scale of the sprite's physics body. Default is {x: 1, y: 1}
		 *
		 * The getter for sprite.scale returns the scale as an object with
		 * x and y properties.
		 *
		 * The valueOf function for sprite.scale returns the scale as a
		 * number. This enables users to do things like `sprite.scale *= 2`
		 * to double the sprite's scale.
		 *
		 * @type {Number|Object}
		 * @default 1
		 */
		get scale() {
			return this._scale;
		}
		set scale(val) {
			if (val <= 0) val = 0.01;
			if (typeof val === 'number') {
				val = { x: val, y: val };
			} else {
				val.x ??= this._scale._x;
				val.y ??= this._scale._y;
			}
			if (val.x == this._scale._x && val.y == this._scale._y) return;

			let scalars = {
				x: val.x / this._scale._x,
				y: val.y / this._scale._y
			};

			this._w *= scalars.x;
			this._hw *= scalars.x;
			if (this._h) {
				this._h *= scalars.y;
				this._hh *= scalars.y;
			}
			this._resizeCollider(scalars);

			this._scale._x = val.x;
			this._scale._y = val.y;
			this._scale._avg = val.x;
		}

		/**
		 * Wake a sprite up or put it to sleep.
		 *
		 * "Sleeping" sprites are not included in the physics simulation, a
		 * sprite starts "sleeping" when it stops moving and doesn't collide
		 * with anything that it wasn't already _touching.
		 *
		 * @type {Boolean}
		 * @default true
		 */
		get sleeping() {
			if (this.body) return !this.body.isAwake();
			return undefined;
		}

		set sleeping(val) {
			if (this.body) this.body.setAwake(!val);
		}

		/**
		 * The sprite's speed.
		 *
		 * @type {Number}
		 * @default 0
		 */
		get speed() {
			return this.p.createVector(this.vel.x, this.vel.y).mag();
		}
		set speed(val) {
			let angle = this.direction;
			this.vel.x = this.p.cos(angle) * val;
			this.vel.y = this.p.sin(angle) * val;
		}

		/**
		 * Is the sprite's physics collider static?
		 *
		 * @type {Boolean}
		 * @default false
		 */
		get static() {
			if (!this.body) return undefined;
			return this.body.isStatic();
		}
		set static(val) {
			if (val) this.collider = 'static';
			else this.collider = 'dynamic';
		}

		/**
		 * The sprite's vertices.
		 *
		 * @type {Array}
		 * @return an array of p5.Vector objects
		 * @readonly
		 */
		get vertices() {
			return this._getVertices();
		}

		_getVertices(output2DArrays) {
			let f = this.fixture;
			while (f.m_next) f = f.m_next;
			let s = f.getShape();
			let v = [...s.m_vertices];
			if (s.m_type == 'polygon') v.unshift(v.at(-1));
			let x = this.x;
			let y = this.y;
			for (let i = 0; i < v.length; i++) {
				let arr = [fixRound((v[i].x / this.tileSize) * plScale + x), fixRound((v[i].y / this.tileSize) * plScale + y)];
				if (output2DArrays) v[i] = arr;
				else v[i] = pInst.createVector(arr[0], arr[1]);
			}
			return v;
		}

		// TODO set vertices

		/**
		 * The horizontal position of the sprite.
		 * @type {Number}
		 */
		get x() {
			return this._pos.x;
		}
		set x(val) {
			this._pos.x = val;
		}
		/**
		 * The vertical position of the sprite.
		 * @type {Number}
		 */
		get y() {
			return this._pos.y;
		}
		set y(val) {
			this._pos.y = val;
		}
		/**
		 * The position vector {x, y}
		 *
		 * @type {p5.Vector}
		 */
		get pos() {
			return this._pos;
		}
		set pos(val) {
			if (this.body) {
				let pos = new pl.Vec2((val.x * this.tileSize) / plScale, (val.y * this.tileSize) / plScale);
				this.body.setPosition(pos);
			}
			this._position.x = val.x;
			this._position.y = val.y;
		}
		/**
		 * The position vector {x, y}
		 *
		 * @type {p5.Vector}
		 */
		get position() {
			return this._pos;
		}
		set position(val) {
			this.pos = val;
		}
		/**
		 * The width of the sprite.
		 * @type {Number}
		 */
		get w() {
			return this._w;
		}
		set w(val) {
			if (val < 0) val = 0.01;
			if (val == this._w) return;
			delete this._dimensionsUndefinedByUser;
			let scalarX = val / this._w;
			this._w = val;
			this._hw = val * 0.5;
			this._resizeCollider({ x: scalarX, y: 1 });
		}
		/**
		 * Half the width of the sprite.
		 * @type {Number}
		 */
		get hw() {
			return this._hw;
		}
		set hw(val) {
			throw new FriendlyError('Sprite.hw');
		}
		/**
		 * The width of the sprite.
		 * @type {Number}
		 */
		get width() {
			return this.w;
		}
		set width(val) {
			this.w = val;
		}
		/**
		 * Half the width of the sprite.
		 * @type {Number}
		 */
		get halfWidth() {
			return this.hw;
		}
		set halfWidth(val) {
			throw new FriendlyError('Sprite.hw');
		}
		/**
		 * The height of the sprite.
		 * @type {Number}
		 */
		get h() {
			if (this.shape == 'circle') return this._w;
			return this._h;
		}
		set h(val) {
			if (val < 0) val = 0.01;
			if (this.shape == 'circle') {
				this.w = val;
				return;
			}
			if (val == this._h) return;
			delete this._dimensionsUndefinedByUser;
			let scalarY = val / this._h;
			this._h = val;
			this._hh = val * 0.5;
			this._resizeCollider({ x: 1, y: scalarY });
		}
		/**
		 * Half the height of the sprite.
		 * @type {Number}
		 */
		get hh() {
			return this._hh || this._hw;
		}
		set hh(val) {
			throw new FriendlyError('Sprite.hh');
		}
		/**
		 * The height of the sprite.
		 * @type {Number}
		 */
		get height() {
			return this.h;
		}
		set height(val) {
			this.h = val;
		}
		/**
		 * Half the height of the sprite.
		 * @type {Number}
		 */
		get halfHeight() {
			return this.hh;
		}
		set halfHeight(val) {
			throw new FriendlyError('Sprite.hh');
		}
		/**
		 * The diameter of a circular sprite.
		 * @type {Number}
		 */
		get d() {
			this._diameter ??= this.w;
			return this._diameter;
		}
		set d(val) {
			if (val < 0) {
				this.remove();
				return;
			}
			let shapeChange = this.shape != 'circle';
			if (!shapeChange) {
				if (this._diameter == val) return;
				this._diameter = val;
			} else {
				let bodyProps;
				if (this._collider != 'none') {
					bodyProps = this._cloneBodyProps();
				}
				this._removeFixtures();
				this._h = undefined;
				this._shape = undefined;
				if (this._collider != 'none') {
					this.addCollider(0, 0, val);
					for (let prop in bodyProps) {
						if (bodyProps[prop] !== undefined) {
							this[prop] = bodyProps[prop];
						}
					}
				}
				this._shape = 'circle';
			}
			let scalar = val / this._w;
			this._w = val;
			this._hw = val * 0.5;
			this._h = val;
			this._hh = this._hw;
			if (shapeChange) return;
			this._resizeCollider({ x: scalar, y: scalar });
		}
		/**
		 * The diameter of a circular sprite.
		 * @type {Number}
		 */
		get diameter() {
			return this.d;
		}
		set diameter(val) {
			this.d = val;
		}

		/**
		 * The radius of a circular sprite.
		 * @type {Number}
		 */
		get r() {
			return this._hw;
		}
		set r(val) {
			this.d = val * 2;
		}

		/**
		 * The radius of a circular sprite.
		 * @type {Number}
		 */
		get radius() {
			return this._hw;
		}
		set radius(val) {
			this.d = val * 2;
		}

		/**
		 * Resizes the collider of the sprite.
		 *
		 * @private
		 * @param {*} scalars The x and y scalars to resize the collider by.
		 */
		_resizeCollider(scalars) {
			if (!this.body) return;

			if (this.shape == 'circle') {
				let fxt = this.fixture;
				let sh = fxt.m_shape;
				sh.m_radius *= scalars.x;
			} else {
				for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
					if (fxt.m_isSensor) continue;
					let sh = fxt.m_shape;
					for (let vert of sh.m_vertices) {
						vert.x *= scalars.x;
						vert.y *= scalars.y;
					}
				}
			}
			if (this.collider == 'static') this.body.synchronizeFixtures();
		}

		/**
		 * Validate convexity.
		 *
		 * @private
		 * @param vecs {Array} an array of planck.Vec2 vertices
		 * @returns true if the polygon is convex
		 */
		_isConvexPoly(vecs) {
			loopk: for (let k = 0; k < 2; k++) {
				if (k == 1) vecs = vecs.reverse();
				for (let i = 0; i < vecs.length; ++i) {
					const i1 = i;
					const i2 = i < vecs.length - 1 ? i1 + 1 : 0;
					const p = vecs[i1];
					const e = pl.Vec2.sub(vecs[i2], p);

					for (let j = 0; j < vecs.length; ++j) {
						if (j == i1 || j == i2) {
							continue;
						}

						const v = pl.Vec2.sub(vecs[j], p);
						const c = pl.Vec2.cross(e, v);
						if (c < 0.0) {
							if (k == 0) continue loopk;
							else return false;
						}
					}
				}
				break;
			}

			return true;
		}

		/**
		 * The kind of shape: 'box', 'circle', 'chain', or 'polygon'.
		 *
		 * @type {String}
		 * @default box
		 */
		get shape() {
			return this._shape;
		}

		set shape(val) {
			if (val == this._shape) return;

			let validShapes = ['box', 'circle', 'chain', 'polygon'];
			if (validShapes.indexOf(val) == -1) {
				throw new Error(
					'Invalid shape type: "' + val + '"\nThe valid shape types are: "' + validShapes.join('", "') + '"'
				);
			}

			if (val == 'circle') {
				this.d = this.w;
			} else {
				this._shape = val;
				this._reset();
			}
		}

		/**
		 * You can set the sprite's update function to a custom
		 * update function which by default, will be run after every p5.js
		 * draw call.
		 *
		 * This function updates the sprite's animation, mouse, and
		 *
		 * There's no way to individually update a sprite or group
		 * of sprites in the physics simulation though.
		 *
		 */
		get update() {
			return this._update;
		}

		set update(val) {
			this._customUpdate = val;
		}

		get vel() {
			return this._vel;
		}

		set vel(val) {
			this.vel.x = val.x;
			this.vel.y = val.y;
		}

		set velocity(val) {
			this.vel = val;
		}

		get velocity() {
			return this._vel;
		}

		_update() {
			if (this._ani) this._ani.update();

			for (let prop in this.mouse) {
				if (this.mouse[prop] == -1) this.mouse[prop] = 0;
			}

			if (this._customUpdate) this._customUpdate();

			if (this.autoUpdate) this.autoUpdate = null;
		}

		_step() {
			if (!this.body && !this.removed) {
				this.rotation += this._rotationSpeed;
				this.x += this.vel.x;
				this.y += this.vel.y;
				return;
			}
			// for each type of collision and overlap event
			let a = this;
			for (let event in eventTypes) {
				for (let k in this[event]) {
					let contactType, b;
					if (k >= 1000) b = this.p.p5play.sprites[k];
					else b = this.p.p5play.groups[k];
					let v = a[event][k] + 1;
					this[event][k] = v;
					if (b instanceof this.p.Group) b[event][a._uid] = v;
					if (!b || v == 0) {
						delete a[event][k];
						if (b instanceof this.p.Group) delete b[event][a._uid];
						continue;
					} else if (v == -1) {
						contactType = eventTypes[event][2];
					} else if (v == 1) {
						contactType = eventTypes[event][0];
					} else {
						contactType = eventTypes[event][1];
					}
					if (b instanceof this.p.Group) continue;

					let cb = this.p.world._findContactCB(contactType, a, b);
					if (typeof cb == 'function') cb(a, b, v);
				}
			}
			if (this.removed) {
				if (Object.keys(this._collisions).length == 0 && Object.keys(this._overlappers).length == 0) {
					delete this.p.p5play.sprites[this._uid];
				}
			}
		}

		/**
		 * Default draw
		 *
		 * @private
		 */
		_draw() {
			if (this.strokeWeight !== undefined) this.p.strokeWeight(this.strokeWeight);
			if (this._ani && this.debug != 'colliders') {
				this._ani.draw(this._offset.x, this._offset.y, 0, this._scale._x, this._scale._y);
			}
			if (!this._ani || this.debug) {
				if (this.debug && this.debug != 'colliders') {
					this.p.noFill();
					this.p.stroke(0, 255, 0);
					this.p.line(0, -2, 0, 2);
					this.p.line(-2, 0, 2, 0);
				}
				if (this.fixture != null) {
					if (this._shape == 'chain') this.p.stroke(this.stroke || this.color);
					else if (this._stroke) this.p.stroke(this._stroke);
					for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
						this._drawFixture(fxt);
					}
				} else {
					this.p.stroke(this._stroke || 120);
					if (this._shape == 'box') {
						this.p.rect(0, 0, this.w * this.tileSize, this.h * this.tileSize);
					} else if (this._shape == 'circle') {
						this.p.circle(0, 0, this.d * this.tileSize);
					}
				}
			}
			if (this.text !== undefined) {
				this.p.textAlign(this.p.CENTER, this.p.CENTER);
				this.p.fill(this.textColor);
				this.p.textSize(this.textSize * this.tileSize);
				this.p.text(this.text, 0, 0);
			}
		}

		/**
		 * Displays the Sprite with rotation and scaling applied before
		 * the sprite's draw function is called.
		 *
		 * @private
		 */
		_display() {
			let x = this.p.width * 0.5 - this.p.world.origin.x + this.x * this.tileSize;
			let y = this.p.height * 0.5 - this.p.world.origin.y + this.y * this.tileSize;

			// skip drawing for out-of-view bodies, but
			// edges can be very long, so they still should be drawn
			if (
				this.shape != 'chain' &&
				this.p.camera.active &&
				(x + this.w < this.p.camera.bound.min.x ||
					x - this.w > this.p.camera.bound.max.x ||
					y + this.h < this.p.camera.bound.min.y ||
					y - this.h > this.p.camera.bound.max.y)
			) {
				return;
			}
			x = fixRound(x);
			y = fixRound(y);

			if (this.pixelPerfect) {
				if (this._w % 2 == 0 || Math.abs((x % 1) - 0.5) > pl.Settings.linearSlop) x = Math.round(x);
				if (this._h % 2 == 0 || Math.abs((y % 1) - 0.5) > pl.Settings.linearSlop) y = Math.round(y);
			}

			// x += this.tileSize * 0.015;
			// y += this.tileSize * 0.015;

			this.p.push();
			this.p.imageMode('center');
			this.p.rectMode('center');
			this.p.ellipseMode('center');

			this.p.translate(x, y);
			if (this.rotation) this.p.rotate(this.rotation);
			this.p.scale(this._mirror._x, this._mirror._y);

			this.p.fill(this.color);

			this._draw();

			this.p.pop();
			this._cameraActiveWhenDrawn = this.p.camera.active;

			if (this.autoDraw) this.autoDraw = null;
		}

		/**
		 * Draws a fixture. Used to draw the sprite's physics body.
		 *
		 * @private
		 */
		_drawFixture(fxt) {
			const sh = fxt.m_shape;
			if (sh.m_type == 'polygon' || sh.m_type == 'chain') {
				if (sh.m_type == 'chain') {
					this.p.push();
					this.p.noFill();
				}
				let v = sh.m_vertices;
				this.p.beginShape();
				for (let i = 0; i < v.length; i++) {
					this.p.vertex(v[i].x * plScale, v[i].y * plScale);
				}
				if (sh.m_type != 'chain') this.p.endShape('close');
				else {
					this.p.endShape();
					this.p.pop();
				}
			} else if (sh.m_type == 'circle') {
				const d = sh.m_radius * 2 * plScale;
				this.p.ellipse(sh.m_p.x * plScale, sh.m_p.y * plScale, d, d);
			} else if (sh.m_type == 'edge') {
				this.p.line(
					sh.m_vertex1.x * plScale,
					sh.m_vertex1.y * plScale,
					sh.m_vertex2.x * plScale,
					sh.m_vertex2.y * plScale
				);
			}
		}

		_args2Vec(x, y) {
			if (Array.isArray(x)) {
				return { x: x[0], y: x[1] };
			} else if (typeof x == 'object') {
				y = x.y;
				x = x.x;
			}
			return { x: x || 0, y: y || 0 };
		}

		/**
		 * Apply a force that is scaled to the sprite's mass.
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} [originX]
		 * @param {Number} [originY]
		 * @example
		 * sprite.applyForce(x, y);
		 * sprite.applyForce(x, y, originX, originY);
		 * sprite.applyForce(x, y, {x: originX, y: originY});
		 * sprite.applyForce({x, y}, {x: originX, y: originY});
		 */
		applyForce(x, y, originX, originY) {
			if (!this.body || (!x && !y)) return;
			if (arguments.length == 2 && typeof y != 'number') {
				originX = y;
			}
			let forceVector = new pl.Vec2(this._args2Vec(x, y));
			forceVector = forceVector.mul(this.body.m_mass);
			if (originX || originY) {
				let o = this._args2Vec(originX, originY);
				let forceOrigin = scaleTo(o.x, o.y, this.tileSize);
				this.body.applyForce(forceVector, forceOrigin, false);
			} else {
				this.body.applyForceToCenter(forceVector, false);
			}
		}

		/**
		 * Apply an impulse to the sprite's physics collider.
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} [originX]
		 * @param {Number} [originY]
		 * @example
		 * sprite.applyImpulse(x, y);
		 * sprite.applyImpulse(x, y, originX, originY);
		 * sprite.applyImpulse(x, y, {x: originX, y: originY});
		 * sprite.applyImpulse({x, y}, {x: originX, y: originY});
		 */
		applyImpulse(x, y, originX, originY) {
			if (!this.body) return;
			if (arguments.length == 2 && typeof y != 'number') {
				originX = y;
			}
			let impulseVector = new pl.Vec2(this._args2Vec(x, y));
			let impulseOrigin;
			if (originX === undefined) {
				impulseOrigin = this.body.getPosition();
			} else {
				let o = this._args2Vec(originX, originY);
				impulseOrigin = scaleTo(o.x, o.y, this.tileSize);
			}
			this.body.applyLinearImpulse(impulseVector, impulseOrigin, true);
		}

		/**
		 * Apply a torque on the sprite's physics body.
		 * Torque is the force that causes rotation.
		 * A positive torque will rotate the sprite clockwise.
		 * A negative torque will rotate the sprite counter-clockwise.
		 *
		 * @param {Number} torque The amount of torque to apply.
		 */
		applyTorque(val) {
			this.body.applyTorque(val, true);
		}

		/**
		 * Deprecated: set sprite.vel instead.
		 *
		 * Sets the velocity vector.
		 *
		 * @deprecated setVelocity
		 * @param {Number} vector|x vector or horizontal velocity
		 * @param {Number} y vertical velocity
		 * @example
		 * sprite.vel = createVector(1, 2);
		 * // OR
		 * sprite.vel.x = 1;
		 * sprite.vel.y = 2;
		 */
		setVelocity(x, y) {
			console.warn('setVelocity() is deprecated. Set sprite.vel instead.');
			if (typeof x == 'object') {
				y = x.y;
				x = x.x;
			}
			this.vel.x = x;
			this.vel.y = y;
		}

		/**
		 * Deprecated: set direction and set speed separately
		 *
		 * Sets the speed of the sprite.
		 * The action overwrites the current velocity.
		 * If direction is not supplied, the current direction is maintained.
		 * If direction is not supplied and there is no current velocity, the
		 * current rotation angle used for the direction.
		 *
		 * @deprecated setSpeed
		 * @param {Number} speed Scalar speed
		 * @param {Number} [direction] angle
		 */
		setSpeed(speed, direction) {
			console.warn('setSpeed is deprecated. Set sprite.direction and sprite.speed separately instead.');
			if (direction) this.direction = direction;
			this.speed = speed;
		}

		/**
		 * Add to the speed of the sprite.
		 * If direction is not supplied, the current direction is maintained.
		 * If direction is not supplied and there is no current velocity, the * current rotation angle used for the direction.
		 *
		 * @param {Number} speed Scalar speed
		 * @param {Number} [angle] Direction in degrees
		 */
		addSpeed(speed, angle) {
			angle ??= this.direction;

			this.vel.x += this.p.cos(angle) * speed;
			this.vel.y += this.p.sin(angle) * speed;
		}

		/**
		 * Move a sprite towards a position.
		 *
		 * @param {Number|Object} x|position destination x or any object with x and y properties
		 * @param {Number} y destination y
		 * @param {Number} tracking [optional] 1 represents 1:1 tracking, the mouse moves to the destination immediately, 0 represents no tracking. Default is 0.1 (10% tracking).
		 */
		moveTowards(x, y, tracking) {
			if (typeof x != 'number') {
				let obj = x;
				if (obj == this.p.mouse && !this.p.mouse.active) return;
				if (obj.x === undefined || obj.y === undefined) {
					console.error(
						'sprite.moveTowards/moveAway ERROR: movement destination not defined, object given with no x or y properties'
					);
					return;
				}
				tracking = y;
				y = obj.y;
				x = obj.x;
			}
			if (x === undefined && y === undefined) return;
			tracking ??= 0.1;

			// let vec = new pl.Vec2(0, 0);
			if (x !== undefined && x !== null) {
				// vec.x = (destX - this.x) * tracking * this.tileSize * this.mass;
				this.vel.x = (x - this.x) * tracking * this.tileSize;
			}
			if (y !== undefined && y !== null) {
				// vec.y = (destY - this.y) * tracking * this.tileSize * this.mass;
				this.vel.y = (y - this.y) * tracking * this.tileSize;
			}
			// this.body.applyForce(vec, new pl.Vec2(0, 0));
		}

		/**
		 * Move a sprite away from a position.
		 *
		 * @param {Number|Object} x|position x or any object with x and y properties
		 * @param {Number} y
		 * @param {Number} repel [optional] the higher the value, the faster the sprite moves away. Default is 0.1 (10% repel).
		 */
		moveAway(x, y, repel) {
			this.moveTowards(...arguments);
			this.vel.x *= -1;
			this.vel.y *= -1;
		}

		/**
		 * Move the sprite a certain distance from its current position.
		 *
		 * @param {Number} distance [optional]
		 * @param {Number|String} direction [optional]
		 * @param {Number} speed [optional]
		 * @returns {Promise} resolves when the movement is complete or cancelled
		 *
		 * @example
		 * sprite.move(distance);
		 * sprite.move(distance, direction);
		 * sprite.move(distance, direction, speed);
		 *
		 * sprite.move(directionName);
		 * sprite.move(directionName, speed);
		 * sprite.move(directionName, speed, distance); // deprecated usage
		 */
		move(distance, direction, speed) {
			let dirNameMode = isNaN(arguments[0]);
			if (dirNameMode) {
				direction = arguments[0];
				speed = arguments[1];
				distance = arguments[2];
				if (distance !== undefined) {
					console.warn(
						`In p5play v3.3.0 the parameter ordering for the move() function was changed to: move(distance, direction, speed).`
					);
				}
			} else {
				dirNameMode = isNaN(direction);
			}
			if (direction !== undefined) this.direction = direction;
			distance ??= 1;
			let x = this.x + this.p.cos(this.direction) * distance;
			let y = this.y + this.p.sin(this.direction) * distance;
			if (dirNameMode && this.tileSize > 1) {
				x = Math.round(x);
				y = Math.round(y);
			} else if (this.direction % 90 == 0) {
				x = fixRound(x);
				y = fixRound(y);
			}
			return this.moveTo(x, y, speed);
		}

		/**
		 * Move the sprite to a position.
		 *
		 * @param {Number|Object} x|position destination x or any object with x and y properties
		 * @param {Number} y destination y
		 * @param {Number} speed [optional]
		 * @returns {Promise} resolves when the movement is complete or cancelled
		 */
		moveTo(x, y, speed) {
			if (typeof x == 'undefined') {
				console.error('sprite.move ERROR: movement direction or destination not defined');
				return;
			}
			if (typeof x != 'number') {
				let obj = x;
				if (obj == this.p.mouse && !this.p.mouse.active) return;
				if (obj.x === undefined || obj.y === undefined) {
					console.error(
						'sprite.moveTo ERROR: movement destination not defined, object given with no x or y properties'
					);
					return;
				}
				speed = y;
				y = obj.y;
				x = obj.x;
			}
			this._dest.x = this.x;
			this._dest.y = this.y;

			let direction = true;

			if (x == this.x) x = false;
			else {
				this._dest.x = x;
				x = true;
			}
			if (y == this.y) y = false;
			else {
				this._dest.y = y;
				y = true;
			}

			this._destIdx++;
			if (!x && !y) return Promise.resolve(true);

			if (this.speed) speed ??= this.speed;
			if (this.tileSize > 1) speed ??= 0.1;
			speed ??= 1;
			if (speed <= 0) {
				console.warn('sprite.move: speed should be a positive number');
				return;
			}

			let a = this._dest.y - this.y;
			let b = this._dest.x - this.x;
			let c = Math.sqrt(a * a + b * b);

			let percent = speed / c;

			this.vel.x = b * percent;
			this.vel.y = a * percent;

			// estimate how many frames it will take for the sprite
			// to reach its destination
			let frames = Math.floor(c / speed) - 5;

			// margin of error
			let margin = speed + 0.01;

			let destIdx = this._destIdx;

			return (async () => {
				let distX = margin + margin;
				let distY = margin + margin;
				do {
					if (destIdx != this._destIdx) return false;

					await pInst.delay();

					// skip calculations if not close enough to destination yet
					if (frames > 0) {
						frames--;
						continue;
					}

					// check if the sprite has reached its destination
					distX = Math.abs(this.x - this._dest.x);
					distY = Math.abs(this.y - this._dest.y);
				} while ((x && distX > margin) || (y && distY > margin));
				// stop moving the sprite, snap to destination
				if (distX < margin) this.x = this._dest.x;
				if (distY < margin) this.y = this._dest.y;
				this.vel.x = 0;
				this.vel.y = 0;
				return true;
			})();
		}

		snap(o, dist) {
			if (o.isMoving || o.x != o._dest.x || o.y != o._dest.y || !this.isMoving) return;
			dist ??= 1 || this.tileSize * 0.1;
			if (Math.abs(this.x) % 1 >= dist || Math.abs(this.y) % 1 >= dist) {
				return;
			}
			this.vel.x = 0;
			this.vel.y = 0;
			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
		}

		/**
		 * Rotates the sprite towards an angle or position
		 * with x and y properties.
		 *
		 * @param {Number|Object} angle|position angle in degrees or an object with x and y properties
		 * @param {Number} tracking percent of the distance to rotate on each frame towards the target angle, default is 0.1 (10%)
		 * @param {Number} facing (only if position is given) rotation angle the sprite should be at when "facing" the position, default is 0
		 */
		rotateTowards(angle, tracking) {
			if (this.__collider == 1) throw new FriendlyError(0);

			let args = arguments;
			let x, y, facing;
			if (typeof args[0] != 'number') {
				x = args[0].x;
				y = args[0].y;
				tracking = args[1];
				facing = args[2];
			} else if (arguments.length > 2) {
				x = args[0];
				y = args[1];
				tracking = args[2];
				facing = args[3];
			}

			if (x !== undefined) angle = this.angleToFace(x, y, facing);
			else {
				angle -= this.rotation;
			}

			tracking ??= 0.1;
			this.rotationSpeed = angle * tracking;
		}

		/**
		 * Finds the angle from this sprite to the given position or object
		 * with x and y properties.
		 *
		 * Can be used to change the direction of a sprite so it moves
		 * to a position or object.
		 *
		 * Used internally by `moveTo` and `moveTowards`.
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @returns {Number} angle
		 * @example
		 * spriteA.direction = spriteA.angleTo(spriteB);
		 */
		angleTo(x, y) {
			if (typeof x == 'object') {
				let obj = x;
				if (obj == this.p.mouse && !this.p.mouse.active) return 0;
				if (obj.x === undefined || obj.y === undefined) {
					console.error(
						'sprite.angleTo ERROR: rotation destination not defined, object given with no x or y properties'
					);
					return 0;
				}
				y = obj.y;
				x = obj.x;
			}

			return this.p.atan2(y - this.y, x - this.x);
		}

		/**
		 * Finds the minimium amount the sprite would have to rotate to
		 * "face" a position at a specified "facing" rotation.
		 *
		 * Used internally by `rotateTo` and `rotateTowards`.
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} facing - rotation angle the sprite should be at when "facing" the position, default is 0
		 * @returns {Number} minimum angle of rotation to face the position
		 */
		angleToFace(x, y, facing) {
			if (typeof x == 'object') {
				facing = y;
				y = x.y;
				x = x.x;
			}
			if (Math.abs(x - this.x) < 0.01 && Math.abs(y - this.y) < 0.01) {
				return 0;
			}
			let ang = this.angleTo(x, y);
			facing ??= 0;
			ang += facing;
			let dist1 = ang - (this.rotation % 360);
			let dist2 = 360 - Math.abs(dist1);
			dist2 *= dist1 < 0 ? 1 : -1;

			return Math.abs(dist1) < Math.abs(dist2) ? dist1 : dist2;
		}

		/**
		 * Rotates the sprite to an angle or to face a position.
		 *
		 * @param {Number|Object} angle|position
		 * @param {Number} speed the amount of rotation per frame, default is 1
		 * @param {Number} facing (only if position is given) the rotation angle the sprite should be at when "facing" the position, default is 0
		 * @returns {Promise} a promise that resolves when the rotation is complete
		 */
		rotateTo(angle, speed) {
			if (this.__collider == 1) throw new FriendlyError(0);

			let args = arguments;
			let x, y, facing;
			if (typeof args[0] != 'number') {
				x = args[0].x;
				y = args[0].y;
				speed = args[1];
				facing = args[2];
			} else if (arguments.length > 2) {
				x = args[0];
				y = args[1];
				speed = args[2];
				facing = args[3];
			}

			if (x !== undefined) angle = this.angleToFace(x, y, facing);
			else {
				if (angle == this.rotation) return;
				angle -= this.rotation;
			}

			return this.rotate(angle, speed);
		}

		/**
		 * Rotates the sprite by an amount at a specified angles per frame speed.
		 *
		 * @param {Number} angle the amount to rotate the sprite
		 * @param {Number} speed the amount of rotation per frame, default is 1
		 * @returns {Promise} a promise that resolves when the rotation is complete
		 */
		rotate(angle, speed) {
			if (this.__collider == 1) throw new FriendlyError(0);
			if (isNaN(angle)) throw new FriendlyError(1, [angle]);
			if (angle == 0) return;
			let absA = Math.abs(angle);
			speed ??= 1;
			if (speed > absA) speed = absA;

			let ang = this.rotation + angle;
			let cw = angle > 0;
			this.rotationSpeed = speed * (cw ? 1 : -1);

			let frames = Math.floor(absA / speed) - 1;
			this._rotateIdx ??= 0;
			this._rotateIdx++;
			let _rotateIdx = this._rotateIdx;

			return (async () => {
				if (frames > 1) {
					while (frames > 0) {
						if (this._rotateIdx != _rotateIdx) return;
						await pInst.delay();
						frames--;
					}
					let limit = Math.abs(this.rotationSpeed) + 0.01;
					while (
						((cw && ang > this.rotation) || (!cw && ang < this.rotation)) &&
						limit < Math.abs(ang - this.rotation)
					) {
						await pInst.delay();
					}
					if (Math.abs(ang - this.rotation) > 0.01) {
						this.rotationSpeed = ang - this.rotation;
						await pInst.delay();
					}
				} else {
					await pInst.delay();
				}
				this.rotationSpeed = 0;
				this.rotation = ang;
			})();
		}

		/**
		 * Changes the sprite's animation. Use `addAni` to define the
		 * animation(s) first.
		 *
		 * @param {...String} anis the names of one or many animations to be played in
		 * sequence
		 * @returns A promise that fulfills when the animation or sequence of animations
		 * completes
		 */
		async changeAni(anis) {
			if (this.p.p5play.disableImages) return;
			if (arguments.length > 1) anis = [...arguments];
			else if (anis instanceof this.p.SpriteAnimation) {
				if (anis == this._ani) return;
				anis = [anis];
			} else if (!Array.isArray(anis)) {
				if (anis == this._ani?.name) return;
				anis = [anis];
			}

			this._aniChangeCount++;
			let loop, stopOnLastAni;
			for (let i = 0; i < anis.length; i++) {
				let ani = anis[i];
				if (
					ani instanceof this.p.SpriteAnimation ||
					ani instanceof p5.Image ||
					(typeof ani == 'string' && ani.length != 1 && ani.includes('.'))
				) {
					ani = this.addAni(ani);
					anis[i] = ani;
				}
				if (typeof ani == 'string') {
					ani = { name: ani };
					anis[i] = ani;
				}
				if (ani.name.length > 1) {
					if (ani.name[0] == '!') {
						ani.name = ani.name.slice(1);
						ani.start = -1;
						ani.end = 0;
					}
					if (ani.name[0] == '<' || ani.name[0] == '>') {
						ani.name = ani.name.slice(1);
						ani.flipX = true;
					}
					if (ani.name[0] == '^') {
						ani.name = ani.name.slice(1);
						ani.flipY = true;
					}
					if (ani.name == '**') {
						loop = true;
						anis = anis.slice(0, -1);
					}
					if (ani.name == ';;') {
						stopOnLastAni = true;
						anis = anis.slice(0, -1);
					}
				}
			}
			let count = this._aniChangeCount;

			do {
				for (let i = 0; i < anis.length; i++) {
					let ani = anis[i];
					if (!ani.start && anis.length > 1) ani.start = 0;
					await this._playSequencedAni(ani);
				}
			} while (loop && count == this._aniChangeCount);
			if (anis.length != 1 && stopOnLastAni) this._ani.stop();
		}

		_playSequencedAni(ani) {
			return new Promise((resolve) => {
				let { name, start, end, flipX, flipY } = ani;
				this._changeAni(name);

				if (flipX) this._ani.scale.x = -this._ani.scale.x;
				if (flipY) this._ani.scale.y = -this._ani.scale.y;

				if (start < 0) start = this._ani.length + start;
				if (start !== undefined) this._ani.frame = start;

				if (end !== undefined) this._ani.goToFrame(end);
				else if (this._ani.frame == this._ani.lastFrame) resolve();

				this._ani._onComplete = this._ani._onChange = () => {
					if (flipX) this._ani.scale.x = -this._ani.scale.x;
					if (flipY) this._ani.scale.y = -this._ani.scale.y;
					this._ani._onComplete = this._ani._onChange = null;
					resolve();
				};
			});
		}

		/**
		 * Changes the sprite's animation. Use `addAni` to define the
		 * animation(s) first. Alt for `changeAni`.
		 *
		 * @param {...String} anis the names of one or many animations to be played in
		 * sequence
		 * @returns A promise that fulfills when the animation or sequence of animations
		 * completes
		 */
		changeAnimation() {
			return this.changeAni(...arguments);
		}

		/**
		 * Changes the displayed animation. The animation must be added first
		 * using the sprite.addAnimation method. The animation could also be
		 * added using the group.addAnimation method to a group the sprite
		 * has been added to.
		 *
		 * See SpriteAnimation for more control over the sequence.
		 *
		 * @private
		 * @param {String} label SpriteAnimation identifier
		 */
		_changeAni(label) {
			if (this._ani?._onChange) this._ani._onChange();
			if (this._ani?.onChange) this._ani.onChange();
			let ani = this.animations[label];
			if (!ani) {
				for (let i = this.groups.length - 1; i >= 0; i--) {
					let g = this.groups[i];
					ani = g.animations[label];
					if (ani) {
						ani = ani.clone();
						break;
					}
				}
			}
			if (!ani) {
				this.p.noLoop();
				throw new FriendlyError('Sprite.changeAnimation', [label]);
			}
			this._ani = ani;
			this._ani.name = label;
			// reset to frame 0 of that animation
			if (this.resetAnimationsOnChange) this._ani.frame = 0;
		}

		/**
		 * Removes the Sprite from the sketch and all the groups it
		 * belongs to.
		 *
		 * When a sprite is removed it will not be drawn or updated anymore.
		 * If it has a physics body, it will be removed from the
		 * physics world simulation.
		 *
		 * There's no way to undo this operation. If you want to hide a
		 * sprite use `sprite.visible = false` instead.
		 *
		 */
		remove() {
			if (this.body) this.p.world.destroyBody(this.body);
			this.body = null;
			this.removed = true;

			// when removed from the "scene" also remove all the references
			// to the sprite from all its groups
			for (let g of this.groups) {
				g.remove(this);
			}

			// all of p5play's references to the sprite can be removed
			// only if the sprite is not colliding or overlapping with anything
			if (Object.keys(this._collisions).length == 0 && Object.keys(this._overlappers).length == 0) {
				delete this.p.p5play.sprites[this._uid];
			}
		}

		/**
		 * Warning: This function might be changed in a future release.
		 *
		 * Returns the sprite's unique identifier
		 *
		 * @returns the sprite's id
		 */
		toString() {
			return 's' + this.idNum;
		}

		_ensureCollide(target, callback) {
			if (!target) {
				throw new FriendlyError('Sprite.collide', 2);
			}
			if (!(target instanceof this.p.Sprite) && !(target instanceof this.p.Group)) {
				throw new FriendlyError('Sprite.collide', 0, [target]);
			}
			if (callback && typeof callback != 'function') {
				throw new FriendlyError('Sprite.collide', 1, [callback]);
			}

			if (this._overlap[target._uid] !== false) {
				this._overlap[target._uid] = false;
			}
			if (target._overlap[this._uid] !== false) {
				target._overlap[this._uid] = false;
				if (target instanceof this.p.Group) {
					for (let s of target) {
						s._overlap[this._uid] = false;
					}
				}
			}
		}

		collide(target, callback) {
			return this.collides(target, callback);
		}

		/**
		 * Returns true on the first frame that the sprite collides with the
		 * target sprite or group.
		 *
		 * Custom collision event handling can be done by using this function
		 * in an if statement or adding a callback as the second parameter.
		 *
		 * @param {Sprite|Group} target
		 * @param {Function} [callback]
		 */
		collides(target, callback) {
			this._ensureCollide(target, callback);
			this._collides[target._uid] = callback || true;
			return this._collisions[target._uid] == 1;
		}

		/**
		 * Returns a truthy value while the sprite is colliding with the
		 * target sprite or group. The value is the number of frames that
		 * the sprite has been colliding with the target.
		 *
		 * @param {Sprite|Group} target
		 * @param {Function} [callback]
		 * @return {Number} frames
		 */
		colliding(target, callback) {
			this._ensureCollide(target, callback);
			this._colliding[target._uid] = callback || true;
			let val = this._collisions[target._uid];
			return val > 0 ? val : 0;
		}

		/**
		 * Returns true on the first frame that the sprite no longer overlaps
		 * with the target sprite or group.
		 *
		 * @param {Sprite|Group} target
		 * @param {Function} [callback]
		 * @return {Boolean}
		 */
		collided(target, callback) {
			this._ensureCollide(target, callback);
			this._collided[target._uid] = callback || true;
			return this._collisions[target._uid] == -1;
		}

		_removeContactsWith(target) {
			if (target instanceof this.p.Group) {
				for (let s of target) {
					this._removeContactsWith(s);
				}
			} else {
				this.__removeContactsWith(target);
			}
		}

		__removeContactsWith(o) {
			if (!this.body) return;
			for (let ce = this.body.getContactList(); ce; ce = ce.next) {
				let c = ce.contact;
				if (c.m_fixtureA.m_body.sprite._uid == o._uid || c.m_fixtureB.m_body.sprite._uid == o._uid) {
					this.p.world.destroyContact(c);
				}
			}
		}

		_ensureOverlap(target, callback) {
			if (!target) {
				throw new FriendlyError('Sprite.overlap', 2);
			}
			if (!(target instanceof this.p.Sprite) && !(target instanceof this.p.Group)) {
				throw new FriendlyError('Sprite.overlap', 0, [target]);
			}
			if (callback && typeof callback != 'function') {
				throw new FriendlyError('Sprite.overlap', 1, [callback]);
			}
			if (!this._hasSensors) this.addDefaultSensors();
			if (!target._hasSensors) {
				if (target instanceof this.p.Sprite) {
					target.addDefaultSensors();
				} else {
					for (let s of target) {
						if (!s._hasSensors) s.addDefaultSensors();
					}
					target._hasSensors = true;
				}
			}
			if (this._overlap[target._uid] != true) {
				this._removeContactsWith(target);
				this._overlap[target._uid] = true;
			}
			if (target._overlap[this._uid] != true) {
				target._removeContactsWith(this);
				target._overlap[this._uid] = true;
				if (target instanceof this.p.Group) {
					for (let s of target) {
						s._overlap[this._uid] = true;
					}
				}
			}
		}

		overlap(target, callback) {
			return this.overlaps(target, callback);
		}

		/**
		 * Returns true on the first frame that the sprite overlaps with the
		 * target sprite or group.
		 *
		 * Custom overlap event handling can be done by using this function
		 * in an if statement or adding a callback as the second parameter.
		 *
		 * @param {Sprite|Group} target
		 * @param {Function} [callback]
		 */
		overlaps(target, callback) {
			this._ensureOverlap(target, callback);
			this._overlaps[target._uid] = callback || true;
			return this._overlappers[target._uid] == 1;
		}

		/**
		 * Returns a truthy value while the sprite is overlapping with the
		 * target sprite or group. The value returned is the number of
		 * frames the sprite has been overlapping with the target.
		 *
		 * @param {Sprite|Group} target
		 * @param {Function} [callback]
		 * @return {Number} frames
		 */
		overlapping(target, callback) {
			this._ensureOverlap(target, callback);
			this._overlapping[target._uid] = callback || true;
			let val = this._overlappers[target._uid];
			return val > 0 ? val : 0;
		}

		/**
		 * Returns true on the first frame that the sprite no longer overlaps
		 * with the target sprite or group.
		 *
		 * @param {Sprite|Group} target
		 * @param {Function} [callback]
		 * @return {Boolean}
		 */
		overlapped(target, callback) {
			this._ensureOverlap(target, callback);
			this._overlapped[target._uid] = callback || true;
			return this._overlappers[target._uid] == -1;
		}

		/**
		 * This function is used automatically if a sprite overlap detection
		 * function is called but the sprite has no overlap sensors.
		 *
		 * It creates sensor fixtures that are the same size as the sprite's
		 * colliders. If you'd like to add more sensors to a sprite, use the
		 * addSensor function.
		 *
		 */
		addDefaultSensors() {
			let shape;
			if (this.body) {
				for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
					if (fxt.m_isSensor) continue;
					shape = fxt.m_shape;
					this.body.createFixture({
						shape: shape,
						isSensor: true
					});
				}
			} else {
				this.addSensor();
			}
			this._hasSensors = true;
		}
	};

	this.Turtle = function (size) {
		if (pInst.allSprites.tileSize > 1) {
			throw new Error(`Turtle can't be used when allSprites.tileSize is greater than 1.`);
		}
		size ??= 25;
		let t = new pInst.Sprite(size, size, [
			[size, size * 0.4],
			[-size, size * 0.4],
			[0, -size * 0.8]
		]);
		t.color = 'green';
		t._isTurtleSprite = true;
		t._prevPos = { x: t.x, y: t.y };
		let _move = t.move;
		t.move = async function () {
			this._prevPos.x = this.x;
			this._prevPos.y = this.y;
			await _move.call(this, ...arguments);
		};
		return t;
	};

	let animationProps = ['frameDelay', 'frameSize', 'looping', 'offset', 'rotation', 'scale', 'demoMode'];

	this.SpriteAnimation = class extends Array {
		/**
		 * <a href="https://p5play.org/learn/sprite_animation.html">
		 * Look at the Animation reference pages before reading these docs.
		 * </a>
		 *
		 * A SpriteAnimation object contains a series of images (p5.Image objects)
		 * that can be displayed sequentially.
		 *
		 * A sprite can have multiple labeled animations, see Sprite.addAnimation
		 * and Sprite.changeAnimation, but you can also create animations that
		 * can be used without being added to a sprite first.
		 *
		 * The SpriteAnimation constructor can be used in multiple ways.
		 * An animation can be created either from a list of images or sequentially
		 * numbered images. p5play will try to detect the sequence pattern.
		 *
		 * For example if the image file path is "image1.png" and the last frame
		 * index is 3 then "image2.png" and "image3.png" will be loaded as well.
		 *
		 * @param {...p5.Image} ...images - p5.Image objects to be used as frames
		 * @example
		 * let shapeShifter = new SpriteAnimation("dog.png", "cat.png", "snake.png");
		 */
		constructor() {
			super();
			this.p = pInst;
			let args = [...arguments];

			/**
			 * The name of the animation
			 *
			 * @type {String}
			 */
			this.name = 'default';

			let owner;

			if (args[0] instanceof this.p.Sprite || args[0] instanceof this.p.Group) {
				owner = args[0];
				args = args.slice(1);
			}
			owner ??= this.p.allSprites;

			if (typeof args[0] == 'string' && (args[0].length == 1 || !args[0].includes('.'))) {
				this.name = args[0];
				args = args.slice(1);
			}

			/**
			 * The index of the current frame that the animation is on.
			 *
			 * @type {Number}
			 */
			this.frame = 0;

			this._cycles = 0;

			this.targetFrame = -1;

			/**
			 * The offset is how far the animation should be placed from
			 * the location it is played at.
			 *
			 * @type {Object}
			 * @example
			 * ani.offset.x = 16;
			 */
			this.offset = { x: owner.anis.offset.x || 0, y: owner.anis.offset.y || 0 };

			this._frameDelay = owner.anis.frameDelay || 4;

			this.demoMode = owner.anis.demoMode || false;

			/**
			 * True if the animation is currently playing.
			 *
			 * @type {Boolean}
			 * @default true
			 */
			this.playing = true;

			/**
			 * Animation visibility.
			 *
			 * @type {Boolean}
			 * @default true
			 */
			this.visible = true;

			/**
			 * If set to false the animation will stop after reaching the last frame
			 *
			 * @type {Boolean}
			 * @default true
			 */
			this.looping = owner.anis.looping;
			this.looping ??= true;

			/**
			 * Ends the loop on frame 0 instead of the last frame.
			 * This is useful for animations that are symmetric.
			 * For example a walking cycle where the first frame is the
			 * same as the last frame.
			 *
			 * @type {Boolean}
			 * @default false
			 */
			this.endOnFirstFrame = false;

			/**
			 * True if frame changed during the last draw cycle
			 *
			 * @type {Boolean}
			 */
			this.frameChanged = false;

			this.onComplete = this.onChange = null;
			this._onComplete = this._onChange = null;

			this.rotation = owner.anis.rotation || 0;
			this._scale = new Scale();

			if (args.length == 0 || typeof args[0] == 'number') return;

			owner.addAni(this);

			// list mode images can be added as a list of arguments or an array
			if (Array.isArray(args[0]) && typeof args[0][0] == 'string') {
				args = [...args[0]];
			}

			// sequence mode
			if (
				args.length == 2 &&
				typeof args[0] == 'string' &&
				(typeof args[1] == 'string' || typeof args[1] == 'number')
			) {
				let from = args[0];
				let to, num2;
				if (!isNaN(args[1])) num2 = Number(args[1]);
				else to = args[1];

				// print("sequence mode "+from+" -> "+to);

				// make sure the extensions are fine
				if (from.slice(-4) != '.png' || (to && to.slice(-4) != '.png')) {
					throw new FriendlyError('SpriteAnimation', 0, [from]);
				}

				let digits1 = 0;
				let digits2 = 0;

				// skip extension work backwards to find the numbers
				for (let i = from.length - 5; i >= 0; i--) {
					if (!isNaN(from.charAt(i))) digits1++;
					else break;
				}

				if (to) {
					for (let i = to.length - 5; i >= 0; i--) {
						if (!isNaN(to.charAt(i))) digits2++;
						else break;
					}
				}

				let prefix1 = from.slice(0, -4 - digits1);
				let prefix2;
				if (to) prefix2 = to.slice(0, -4 - digits2);

				// images don't belong to the same sequence
				// they are just two separate images with numbers
				if (to && prefix1 != prefix2) {
					this.push(this.p.loadImage(from));
					this.push(this.p.loadImage(to));
				} else {
					// Our numbers likely have leading zeroes, which means that some
					// browsers (e.g., PhantomJS) will interpret them as base 8 (octal)
					// instead of decimal. To fix this, we'll explicity tell parseInt to
					// use a base of 10 (decimal). For more details on this issue, see
					// http://stackoverflow.com/a/8763427/2422398.
					let num1 = parseInt(from.slice(-4 - digits1, -4), 10);
					num2 ??= parseInt(to.slice(-4 - digits2, -4), 10);

					// swap if inverted
					if (num2 < num1) {
						let t = num2;
						num2 = num1;
						num1 = t;
					}

					let fileName;
					if (!to || digits1 == digits2) {
						// load all images
						for (let i = num1; i <= num2; i++) {
							// Use nf() to number format 'i' into the amount of digits
							// ex: 14 with 4 digits is 0014
							fileName = prefix1 + this.p.nf(i, digits1) + '.png';
							this.push(this.p.loadImage(fileName));
						}
					} // case: case img1, img2
					else {
						for (let i = num1; i <= num2; i++) {
							// Use nf() to number format 'i' into four digits
							fileName = prefix1 + i + '.png';
							this.push(this.p.loadImage(fileName));
						}
					}
				}
			} // end sequence mode

			// SpriteSheet mode
			else if (typeof args[args.length - 1] != 'string' && !(args[args.length - 1] instanceof p5.Image)) {
				let sheet = owner.spriteSheet;
				let atlas;
				if (args[0] instanceof p5.Image || typeof args[0] == 'string') {
					if (args.length >= 3) {
						throw new FriendlyError('SpriteAnimation', 1);
					}
					sheet = args[0];
					atlas = args[1];
				} else {
					atlas = args[0];
				}

				let _this = this;

				if (sheet instanceof p5.Image && sheet.width != 1 && sheet.height != 1) {
					this.spriteSheet = sheet;
					_generateSheetFrames();
				} else {
					let url;
					if (typeof sheet == 'string') url = sheet;
					else url = sheet.url;
					this.spriteSheet = this.p.loadImage(url, () => {
						_generateSheetFrames();
					});
				}

				function _generateSheetFrames() {
					if (Array.isArray(atlas) || Array.isArray(atlas.frames)) {
						if (typeof atlas[0] == 'number') {
							if (atlas.length == 4) {
								atlas = { pos: atlas.slice(0, 2), size: atlas.slice(2) };
							} else {
								atlas = { pos: atlas };
							}
						} else {
							let frames = atlas;
							if (Array.isArray(atlas.frames)) {
								frames = atlas.frames;
								delete atlas.frames;
								for (let i = 0; i < frames.length; i++) {
									frames[i] = {
										pos: frames[i]
									};
									Object.assign(frames[i], atlas);
								}
							}
							for (let frame of frames) {
								atlas = frame;
								_generateSheetFrames();
							}
							return;
						}
					}

					let {
						w,
						h,
						width,
						height,
						size,
						row,
						col,
						line,
						x,
						y,
						pos,
						frames,
						frameCount,
						frameDelay,
						frameSize,
						delay,
						rotation
					} = atlas;
					frameSize ??= size || owner.anis.frameSize;
					if (delay) _this.frameDelay = delay;
					if (frameDelay) _this.frameDelay = frameDelay;
					if (rotation) _this.rotation = rotation;
					frameCount ??= frames || 1;
					w ??= width || owner.anis.w;
					h ??= height || owner.anis.h;
					x ??= col || 0;
					y ??= line || row || 0;
					if (pos) {
						x = pos[0];
						y = pos[1];
					}

					if (typeof frameSize == 'number') {
						w = h = frameSize;
					} else if (frameSize) {
						w = frameSize[0];
						h = frameSize[1];
					}

					let tileSize = owner.tileSize;

					if (!w || !h) {
						if (!owner._dimensionsUndefinedByUser) {
							w = owner.w;
							h = owner.h;
						} else if (tileSize) {
							w = h = tileSize;
						} else if (frameCount) {
							w = _this.spriteSheet.width / frameCount;
							h = _this.spriteSheet.height;
						} else {
							if (_this.spriteSheet.width < _this.spriteSheet.height) {
								w = h = _this.spriteSheet.width;
							} else {
								w = h = _this.spriteSheet.height;
							}
						}
					} else {
						w *= tileSize;
						h *= tileSize;
					}

					// get the real dimensions and position of the frame
					// in the sheet
					if (tileSize != 1) {
						x *= tileSize;
						y *= tileSize;
					} else if (line !== undefined || row !== undefined || col !== undefined) {
						x *= w;
						y *= h;
					}

					// add all the frames in the animation to the frames array
					for (let i = 0; i < frameCount; i++) {
						_this.push({ x, y, w, h });
						x += w;
						if (x >= _this.spriteSheet.width) {
							x = 0;
							y += h;
							if (y >= _this.spriteSheet.height) y = 0;
						}
					}
				}
			} // end SpriteSheet mode
			else {
				// list of images
				for (let i = 0; i < args.length; i++) {
					if (args[i] instanceof p5.Image) this.push(args[i]);
					else this.push(this.p.loadImage(args[i]));
				}
			}
		}

		/**
		 * Delay between frames in number of draw cycles.
		 * If set to 4 the framerate of the animation would be the
		 * sketch framerate divided by 4 (60fps = 15fps)
		 *
		 * @type {Number}
		 * @default 4
		 */
		get frameDelay() {
			return this._frameDelay;
		}
		set frameDelay(val) {
			if (val <= 0) val = 1;
			this._frameDelay = val;
		}
		/**
		 * TODO frameRate
		 * Another way to set the animation's frame delay.
		 */
		// get frameRate() {

		// }
		// set frameRate(val) {

		// }

		/**
		 * The animation's scale.
		 *
		 * Can be set to a number to scale both x and y
		 * or an object with x and/or y properties.
		 *
		 * @type {Number|Object}
		 * @default 1
		 */
		get scale() {
			return this._scale;
		}
		set scale(val) {
			if (typeof val == 'number') {
				val = { x: val, y: val };
			}
			this._scale._x = val.x;
			this._scale._y = val.y;
			this._scale._avg = val.x;
		}

		/**
		 * Make a copy of the animation.
		 *
		 * @return {SpriteAnimation} A copy of the animation.
		 */
		clone() {
			let ani = new this.p.SpriteAnimation();
			ani.spriteSheet = this.spriteSheet;
			for (let i = 0; i < this.length; i++) {
				ani.push(this[i]);
			}
			ani.offset.x = this.offset.x;
			ani.offset.y = this.offset.y;
			ani.frameDelay = this.frameDelay;
			ani.playing = this.playing;
			ani.looping = this.looping;
			ani.rotation = this.rotation;
			return ani;
		}

		/**
		 * Draws the animation at coordinate x and y.
		 * Updates the frames automatically.
		 *
		 * Optional parameters effect the current draw cycle only and
		 * are not saved between draw cycles.
		 *
		 * @param {Number} x horizontal position
		 * @param {Number} y vertical position
		 * @param {Number} [r] rotation
		 * @param {Number} [sx] scale x
		 * @param {Number} [sy] scale y
		 */
		draw(x, y, r, sx, sy) {
			this.x = x || 0;
			this.y = y || 0;

			if (!this.visible) return;

			sx ??= 1;
			sy ??= 1;

			this.p.push();
			this.p.imageMode('center');
			this.p.translate(this.x, this.y);
			this.p.rotate(r || this.rotation);
			this.p.scale(sx * this._scale._x, sy * this._scale._y);
			let img = this[this.frame];
			if (img !== undefined) {
				if (this.spriteSheet) {
					let { x, y, w, h } = img; // image info
					if (!this.demoMode) {
						this.p.image(this.spriteSheet, this.offset.x, this.offset.y, w, h, x, y, w, h);
					} else {
						this.p.image(
							this.spriteSheet,
							this.offset.x,
							this.offset.y,
							this.spriteSheet.w,
							this.spriteSheet.h,
							x - this.spriteSheet.w / 2 + w / 2,
							y - this.spriteSheet.h / 2 + h / 2
						);
					}
				} else {
					this.p.image(img, this.offset.x, this.offset.y);
				}
			} else {
				log(
					'Warning: ' +
						this.name +
						' animation not loaded yet or frame ' +
						this.frame +
						' does not exist. Load this animation in the p5.js preload function if you need to use it at the start of your program.'
				);
			}

			this.p.pop();
		}

		update() {
			this._cycles++;
			var previousFrame = this.frame;
			this.frameChanged = false;

			//go to frame
			if (this.length === 1) {
				this.playing = false;
				this.frame = 0;
			}

			if (this.playing && this._cycles % this.frameDelay === 0) {
				this.frameChanged = true;

				if ((this.targetFrame == -1 && this.frame == this.lastFrame) || this.frame == this.targetFrame) {
					if (this.endOnFirstFrame) this.frame = 0;
					if (this.looping) this.targetFrame = -1;
					else this.playing = false;
					if (this._onComplete) this._onComplete();
					if (this.onComplete) this.onComplete(); //fire when on last frame
					if (!this.looping) return;
				}

				//going to target frame up
				if (this.targetFrame > this.frame && this.targetFrame !== -1) {
					this.frame++;
				}
				//going to target frame down
				else if (this.targetFrame < this.frame && this.targetFrame !== -1) {
					this.frame--;
				} else if (this.targetFrame === this.frame && this.targetFrame !== -1) {
					this.playing = false;
				} else if (this.looping) {
					//advance frame
					//if next frame is too high
					if (this.frame >= this.lastFrame) {
						this.frame = 0;
					} else this.frame++;
				} else {
					//if next frame is too high
					if (this.frame < this.lastFrame) this.frame++;
				}
			}
		}

		/**
		 * Plays the animation, starting from the specified frame.
		 *
		 * @returns [Promise] a promise that resolves when the animation completes
		 */
		play(frame) {
			this.playing = true;
			if (frame !== undefined) this.frame = frame;
			this.targetFrame = -1;
			return new Promise((resolve) => {
				this._onComplete = () => {
					this._onComplete = null;
					resolve();
				};
			});
		}

		/**
		 * Pauses the animation.
		 *
		 */
		pause(frame) {
			this.playing = false;
			if (frame) this.frame = frame;
		}

		/**
		 * Stops the animation. Alt for pause.
		 *
		 */
		stop(frame) {
			this.playing = false;
			if (frame) this.frame = frame;
		}

		/**
		 * Plays the animation backwards.
		 * Equivalent to ani.goToFrame(0)
		 *
		 * @returns [Promise] a promise that resolves when the animation completes
		 * rewinding
		 */
		rewind() {
			this.looping = false;
			return this.goToFrame(0);
		}

		/**
		 * Plays the animation forwards and loops it.
		 *
		 */
		loop() {
			this.looping = true;
			this.playing = true;
		}

		/**
		 * Prevents the animation from looping
		 *
		 */
		noLoop() {
			this.looping = false;
		}

		/**
		 * Goes to the next frame and stops.
		 *
		 */
		nextFrame() {
			if (this.frame < this.length - 1) this.frame = this.frame + 1;
			else if (this.looping) this.frame = 0;

			this.targetFrame = -1;
			this.playing = false;
		}

		/**
		 * Goes to the previous frame and stops.
		 *
		 */
		previousFrame() {
			if (this.frame > 0) this.frame = this.frame - 1;
			else if (this.looping) this.frame = this.length - 1;

			this.targetFrame = -1;
			this.playing = false;
		}

		/**
		 * Plays the animation forward or backward toward a target frame.
		 *
		 * @param {Number} toFrame Frame number destination (starts from 0)
		 * @returns [Promise] a promise that resolves when the animation completes
		 */
		goToFrame(toFrame) {
			if (toFrame < 0 || toFrame >= this.length) {
				return;
			}

			// targetFrame gets used by the update() method to decide what frame to
			// select next.  When it's not being used it gets set to -1.
			this.targetFrame = toFrame;

			if (this.targetFrame !== this.frame) {
				this.playing = true;
			}
			return new Promise((resolve) => {
				this._onComplete = () => {
					this._onComplete = null;
					resolve();
				};
			});
		}

		/**
		 * Returns the index of the last frame.
		 *
		 * @type {Number}
		 * @readonly
		 */
		get lastFrame() {
			return this.length - 1;
		}

		/**
		 * Returns the current frame as p5.Image.
		 *
		 * @type {p5.Image}
		 * @readonly
		 */
		get frameImage() {
			let f = this.frame;
			let img = this[f];
			if (img instanceof p5.Image) return img;

			let { x, y, w, h } = img; // image info
			let g = createGraphics(w, h);
			g.image(this.spriteSheet, this.offset.x, this.offset.y, w, h, x, y, w, h);
			return g;
		}

		/**
		 * Width of the animation.
		 *
		 * @type {Number}
		 */
		get w() {
			return this.width;
		}
		/**
		 * Width of the animation.
		 *
		 * @type {Number}
		 */
		get width() {
			if (this[this.frame] instanceof p5.Image) {
				return this[this.frame].width;
			} else if (this[this.frame]) {
				return this[this.frame].w;
			}
			return 1;
		}

		/**
		 * Height of the animation.
		 *
		 * @type {Number}
		 */
		get h() {
			return this.height;
		}
		/**
		 * Height of the animation.
		 *
		 * @type {Number}
		 */
		get height() {
			if (this[this.frame] instanceof p5.Image) {
				return this[this.frame].height;
			} else if (this[this.frame]) {
				return this[this.frame].h;
			}
			return 1;
		}

		/**
		 * The frames of the animation.
		 *
		 * @type {Array}
		 */
		get frames() {
			let frames = [];
			for (let i = 0; i < this.length; i++) {
				frames.push(this[i]);
			}
			return frames;
		}

		/**
		 * The frames of the animation. Alt for ani.frames
		 *
		 * @type {Array}
		 */
		get images() {
			return this.frames;
		}
	};

	/**
	 * This SpriteAnimations class serves the same role that Group does
	 * for Sprites. Except it doesn't extend Array, its instances are
	 * objects. It is used to create `sprite.anis` and `group.anis`.
	 *
	 * In instances of this class, the keys are animation names,
	 * values are SpriteAnimation objects.
	 *
	 * Because users only expect instances of this class to contain
	 * animation names as keys, it uses a internal private object
	 * #_ to store animation properties. Getters and setters are used to
	 * access the private properties, enabling dynamic inheritance.
	 *
	 * @private
	 */
	this.SpriteAnimations = class {
		#_ = {};
		constructor() {
			let _this = this;

			let props = [...animationProps];
			for (let prop of props) {
				Object.defineProperty(this, prop, {
					get() {
						return _this.#_[prop];
					},
					set(val) {
						_this.#_[prop] = val;

						// change the prop in all the sprite of this group
						for (let k in _this) {
							let x = _this[k];
							if (!(x instanceof SpriteAnimation)) continue;
							x[prop] = val;
						}
					}
				});
			}

			let objProps = { offset: ['x', 'y'], scale: ['x', 'y'] };
			for (let objProp in objProps) {
				this.#_[objProp] = {};
				for (let prop of objProps[objProp]) {
					Object.defineProperty(this.#_[objProp], prop, {
						get() {
							return _this.#_[objProp]['_' + prop];
						},
						set(val) {
							_this.#_[objProp]['_' + prop] = val;

							for (let k in _this) {
								let x = _this[k];
								if (!(x instanceof SpriteAnimation)) continue;
								x[objProp][prop] = val;
							}
						}
					});
				}
			}
		}
	};

	this.Group = class extends Array {
		/**
		 * <a href="https://p5play.org/learn/group.html">
		 * Look at the Group reference pages before reading these docs.
		 * </a>
		 *
		 * A Group is a collection of sprites with similar traits and behaviors.
		 *
		 * For example a group may contain all the coin sprites that the
		 * player can collect.
		 *
		 * Group extends Array. You can use them in for loops just like arrays
		 * since they inherit all the functions and properties of standard
		 * arrays such as group.length and function like group.includes().
		 *
		 * Since groups just contain references to sprites, a sprite can be in
		 * multiple groups.
		 *
		 * `sprite.remove()` removes the sprite from all the groups
		 * it belongs to. `group.removeAll()` removes all the sprites from
		 * a group.
		 *
		 * The top level group is a p5 instance level variable named
		 * `allSprites` that contains all the sprites added to the sketch.
		 */
		constructor(...args) {
			let parent;
			if (args[0] instanceof pInst.Group) {
				parent = args[0];
				args = args.slice(1);
			}
			super(...args);
			this.p = pInst;

			if (typeof args[0] == 'number') return;
			for (let s of this) {
				if (!(s instanceof this.p.Sprite)) {
					throw new Error('A group can only contain sprites');
				}
			}

			/**
			 * Each group has a unique id number. Don't change it!
			 * Its useful for debugging.
			 *
			 * @type {Number}
			 */
			this.idNum = this.p.p5play.groupsCreated;
			this._uid = this.idNum;
			this.p.p5play.groups[this._uid] = this;
			this.p.p5play.groupsCreated++;

			// if the allSprites group doesn't exist yet,
			// this group must be the allSprites group!
			if (!this.p.allSprites) this._isAllSpritesGroup = true;

			/**
			 * Groups can have subgroups, which inherit the properties
			 * of their parent groups.
			 *
			 * @type {Array}
			 * @default []
			 */
			this.subgroups = [];

			/**
			 * The parent group's uid number.
			 *
			 * @type {Number}
			 * @default undefined
			 */
			if (parent instanceof this.p.Group) {
				parent.subgroups.push(this);
				let p = parent;
				do {
					p = this.p.p5play.groups[p.parent];
					p.subgroups.push(this);
				} while (!p._isAllSpritesGroup);
				this.parent = parent._uid;
			} else if (!this._isAllSpritesGroup) {
				this.p.allSprites.subgroups.push(this);
				this.parent = 0;
			}

			/**
			 * Keys are the animation label, values are SpriteAnimation objects.
			 *
			 * @type {SpriteAnimations}
			 */
			this.animations = new this.p.SpriteAnimations();

			/**
			 * Contains all the collision callback functions for this group
			 * when it comes in contact with other sprites or groups.
			 */
			this._collides = {};
			this._colliding = {};
			this._collided = {};

			this._overlap = {};
			/**
			 * Contains all the overlap callback functions for this group
			 * when it comes in contact with other sprites or groups.
			 */
			this._overlaps = {};
			this._overlapping = {};
			this._overlapped = {};

			this._collisions = {};
			this._overlappers = {};

			let _this = this;

			this.Sprite = class extends this.p.Sprite {
				constructor() {
					super(_this, ...arguments);
				}
			};
			this.GroupSprite = this.Sprite;

			this.Group = class extends this.p.Group {
				constructor() {
					super(_this, ...arguments);
				}
			};
			this.Subgroup = this.Group;

			this.mouse = {
				presses: null,
				pressing: null,
				pressed: null,
				holds: null,
				holding: null,
				held: null,
				released: null,
				hovers: null,
				hovering: null,
				hovered: null
			};
			for (let state in this.mouse) {
				this.mouse[state] = function (inp) {
					for (let s of _this) {
						if (s.mouse[state](inp)) return true;
					}
					return false;
				};
			}

			let props = [...spriteProps, 'spriteSheet'];
			for (let prop of props) {
				Object.defineProperty(this, prop, {
					get() {
						let val = _this['_' + prop];
						let i = _this.length - 1;
						if (val === undefined && !_this._isAllSpritesGroup) {
							let parent = this.p.p5play.groups[_this.parent];
							if (parent) {
								val = parent[prop];
								i = parent.length - 1;
							}
						}
						return val;
					},
					set(val) {
						_this['_' + prop] = val;

						// change the prop in all the sprite of this group
						for (let i = 0; i < _this.length; i++) {
							let s = _this[i];
							let v = val;
							if (typeof val == 'function') v = val(i);
							s[prop] = v;
						}
					}
				});
			}

			this.vel = pInst.createVector.call(pInst);
			this.mirror = {};
			this.offset = {};
			this.scale = {};

			let objProps = { vel: ['x', 'y'], mirror: ['x', 'y'], offset: ['x', 'y'], scale: ['x', 'y'] };
			for (let objProp in objProps) {
				for (let prop of objProps[objProp]) {
					Object.defineProperty(this[objProp], prop, {
						get() {
							let val = _this[objProp]['_' + prop];
							let i = _this.length - 1;
							if (val === undefined && !_this._isAllSpritesGroup) {
								let parent = _this.p.p5play.groups[_this.parent];
								if (parent) {
									val = parent[objProp][prop];
									i = parent.length - 1;
								}
							}
							return val;
						},
						set(val) {
							_this[objProp]['_' + prop] = val;

							// change the prop in all the sprite of this group
							for (let i = 0; i < _this.length; i++) {
								let s = _this[i];
								let v = val;
								if (typeof val == 'function') v = val(i);
								s[objProp][prop] = v;
							}
						}
					});
				}
			}

			this._orbitAngle = 0;

			if (this._isAllSpritesGroup) {
				/**
				 * autoCull is a property of the allSprites group only,
				 * that controls whether sprites are automatically removed
				 * when they are 10,000 pixels away from the camera.
				 *
				 * It only needs to be set to false once and then it will
				 * remain false for the rest of the sketch, unless changed.
				 *
				 * @type {Boolean}
				 */
				this.autoCull = true;
				this.tileSize = 1;
			}

			this.autoDraw = true;
			this.autoUpdate = true;

			/**
			 * Alias for group.push
			 *
			 * Its better to use the group Sprite constructor instead.
			 * `new group.Sprite()` which both creates a group sprite using
			 * soft inheritance and adds it to the group.
			 *
			 * @memberof Group
			 * @instance
			 * @func add
			 */
			this.add = this.push;

			/**
			 * Check if a sprite is in the group.
			 *
			 * @memberof Group
			 * @instance
			 * @func includes
			 * @param {Sprite} sprite
			 * @return {Number} index of the sprite or -1 if not found
			 */

			/**
			 * Alias for group.includes
			 */
			this.contains = this.includes;
		}

		/**
		 * Returns the highest layer in a group
		 *
		 * @private
		 * @return {Number} The layer of the sprite drawn on the top
		 */
		_getTopLayer() {
			if (this.length == 0) return 0;
			if (this.length == 1 && this[0].layer === undefined) return 0;
			let max = this[0].layer;
			for (let s of this) {
				if (s.layer > max) max = s.layer;
			}
			return max;
		}

		/**
		 * Reference to the group's current animation.
		 *
		 * @type {SpriteAnimation}
		 */
		get ani() {
			return this._ani;
		}
		set ani(val) {
			this.addAni(val);
			for (let s of this) s.changeAni(val);
		}
		/**
		 * Reference to the group's current animation.
		 *
		 * @type {SpriteAnimation}
		 */
		get animation() {
			return this._ani;
		}
		set animation(val) {
			this.ani = val;
		}

		/**
		 * The group's animations.
		 *
		 * @type {SpriteAnimations}
		 */
		get anis() {
			return this.animations;
		}
		/**
		 * Reference to the group's current image.
		 *
		 * @type {p5.Image}
		 */
		get img() {
			return this._ani.frameImage;
		}
		set img(val) {
			this.ani = val;
		}
		/**
		 * Reference to the group's current image.
		 *
		 * @type {p5.Image}
		 */
		get image() {
			return this._ani.frameImage;
		}
		set image(val) {
			this.ani = val;
		}
		/**
		 * Depending on the value that the amount property is set to, the group will
		 * either add or remove sprites.
		 *
		 * @type {Number}
		 */
		set amount(val) {
			let diff = val - this.length;
			let shouldAdd = diff > 0;
			diff = Math.abs(diff);
			for (let i = 0; i < diff; i++) {
				if (shouldAdd) new this.Sprite();
				else this[this.length - 1].remove();
			}
		}

		resetCentroid() {
			let x = 0;
			let y = 0;
			for (let s of this) {
				x += s.x;
				y += s.y;
			}
			this.centroid = { x: x / this.length, y: y / this.length };
			return this.centroid;
		}

		resetDistancesFromCentroid() {
			for (let s of this) {
				s.distCentroid = {
					x: s.x - this.centroid.x,
					y: s.y - this.centroid.y
				};
			}
		}

		snap(o, dist) {
			dist ??= 1 || this.tileSize * 0.1;
			for (let s of this) {
				s.snap(o, dist);
			}
		}

		_ensureCollide(target, callback) {
			if (!target) {
				throw new FriendlyError('Group.collide', 2);
			}
			if (!(target instanceof this.p.Sprite) && !(target instanceof this.p.Group)) {
				throw new FriendlyError('Group.collide', 0, [target]);
			}
			if (callback && typeof callback != 'function') {
				throw new FriendlyError('Group.collide', 1, [callback]);
			}

			if (this._overlap[target._uid] !== false) {
				this._overlap[target._uid] = false;
				for (let s of this) {
					s._overlap[target._uid] = false;
				}
			}
			if (target._overlap[this._uid] !== false) {
				target._overlap[this._uid] = false;
				if (target instanceof this.p.Group) {
					for (let s of target) {
						s._overlap[this._uid] = false;
					}
				}
			}
		}

		collide(target, callback) {
			return this.collides(target, callback);
		}

		/**
		 * Returns true on the first frame that the group collides with the
		 * target sprite or group.
		 *
		 * Custom collision event handling can be done by using this function
		 * in an if statement or adding a callback as the second parameter.
		 *
		 * @param {Sprite|Group} target
		 * @param {Function} [callback]
		 */
		collides(target, callback) {
			this._ensureCollide(target, callback);
			this._collides[target._uid] = callback || true;
			return this._collisions[target._uid] == 1;
		}

		/**
		 * Returns a truthy value while the group is colliding with the
		 * target sprite or group. The value is the number of frames that
		 * the group has been colliding with the target.
		 *
		 * @param {Sprite|Group} target
		 * @param {Function} [callback]
		 * @return {Number} frames
		 */
		colliding(target, callback) {
			this._ensureCollide(target, callback);
			this._colliding[target._uid] = callback || true;
			let val = this._collisions[target._uid];
			return val > 0 ? val : 0;
		}

		/**
		 * Returns true on the first frame that the group no longer overlaps
		 * with the target sprite or group.
		 *
		 * @param {Sprite|Group} target
		 * @param {Function} [callback]
		 * @return {Boolean}
		 */
		collided(target, callback) {
			this._ensureCollide(target, callback);
			this._collided[target._uid] = callback || true;
			return this._collisions[target._uid] == -1;
		}

		_removeContactsWith(o) {
			for (let s of this) {
				s._removeContactsWith(o);
			}
		}

		_ensureOverlap(target, callback) {
			if (!target) {
				throw new FriendlyError('Group.overlap', 2);
			}
			if (!(target instanceof this.p.Sprite) && !(target instanceof this.p.Group)) {
				throw new FriendlyError('Group.overlap', 0, [target]);
			}
			if (callback && typeof callback != 'function') {
				throw new FriendlyError('Group.overlap', 1, [callback]);
			}
			if (!this._hasSensors) {
				for (let s of this) {
					if (!s._hasSensors) s.addDefaultSensors();
				}
				this._hasSensors = true;
			}
			if (!target._hasSensors) {
				if (target instanceof this.p.Sprite) {
					target.addDefaultSensors();
				} else {
					for (let s of target) {
						if (!s._hasSensors) s.addDefaultSensors();
					}
					target._hasSensors = true;
				}
			}
			if (this._overlap[target._uid] != true) {
				this._removeContactsWith(target);
				this._overlap[target._uid] = true;
				for (let s of this) {
					s._overlap[target._uid] = true;
				}
			}
			if (target._overlap[this._uid] != true) {
				target._removeContactsWith(this);
				target._overlap[this._uid] = true;
				if (target instanceof this.p.Group) {
					for (let s of target) {
						s._overlap[this._uid] = true;
					}
				}
			}
		}

		overlap(target, callback) {
			return this.overlaps(target, callback);
		}

		/**
		 * Returns true on the first frame that the group overlaps with the
		 * target sprite or group.
		 *
		 * Custom overlap event handling can be done by using this function
		 * in an if statement or adding a callback as the second parameter.
		 *
		 * @param {Sprite|Group} target
		 * @param {Function} [callback]
		 */
		overlaps(target, callback) {
			this._ensureOverlap(target, callback);
			this._overlaps[target._uid] = callback || true;
			return this._overlappers[target._uid] == 1;
		}

		/**
		 * Returns a truthy value while the group is overlapping with the
		 * target sprite or group. The value returned is the number of
		 * frames the group has been overlapping with the target.
		 *
		 * @param {Sprite|Group} target
		 * @param {Function} [callback]
		 * @return {Number} frames
		 */
		overlapping(target, callback) {
			this._ensureOverlap(target, callback);
			this._overlapping[target._uid] = callback || true;
			let val = this._overlappers[target._uid];
			return val > 0 ? val : 0;
		}

		/**
		 * Returns true on the first frame that the group no longer overlaps
		 * with the target sprite or group.
		 *
		 * @param {Sprite|Group} target
		 * @param {Function} [callback]
		 * @return {Boolean}
		 */
		overlapped(target, callback) {
			this._ensureOverlap(target, callback);
			this._overlapped[target._uid] = callback || true;
			return this._overlappers[target._uid] == -1;
		}

		/**
		 * Apply a force that is scaled to the sprite's mass.
		 *
		 * @param {p5.Vector|Array} forceVector force vector
		 * @param {p5.Vector|Array} [forceOrigin] force origin
		 */
		applyForce(forceVector, forceOrigin) {
			for (let s of this) {
				s.applyForce(forceVector, forceOrigin);
			}
		}

		/**
		 */
		move(distance, direction, speed) {
			let movements = [];
			for (let s of this) {
				movements.push(s.move(distance, direction, speed));
			}
			return Promise.all(movements);
		}

		/**
		 */
		moveTo(x, y, speed) {
			if (typeof x != 'number') {
				let obj = x;
				if (obj == this.p.mouse && !this.p.mouse.active) return;
				speed = y;
				y = obj.y;
				x = obj.x;
			}
			let centroid = this.resetCentroid();
			let movements = [];
			for (let s of this) {
				let dest = {
					x: s.x - centroid.x + x,
					y: s.y - centroid.y + y
				};
				movements.push(s.moveTo(dest.x, dest.y, speed));
			}
			return Promise.all(movements);
		}

		/**
		 */
		moveTowards(x, y, tracking) {
			if (typeof x != 'number') {
				let obj = x;
				if (obj == this.p.mouse && !this.p.mouse.active) return;
				tracking = y;
				y = obj.y;
				x = obj.x;
			}
			if (x === undefined && y === undefined) return;
			this.resetCentroid();
			for (let s of this) {
				if (s.distCentroid === undefined) this.resetDistancesFromCentroid();
				let dest = {
					x: s.distCentroid.x + x,
					y: s.distCentroid.y + y
				};
				s.moveTowards(dest.x, dest.y, tracking);
			}
		}

		/**
		 */
		moveAway(x, y, tracking) {
			if (typeof x != 'number') {
				let obj = x;
				if (obj == this.p.mouse && !this.p.mouse.active) return;
				tracking = y;
				y = obj.y;
				x = obj.x;
			}
			if (x === undefined && y === undefined) return;
			this.resetCentroid();
			for (let s of this) {
				if (s.distCentroid === undefined) this.resetDistancesFromCentroid();
				let dest = {
					x: s.distCentroid.x + x,
					y: s.distCentroid.y + y
				};
				s.moveAway(dest.x, dest.y, tracking);
			}
		}

		/**
		 * EXPERIMENTAL! Subject to change in the future!
		 *
		 * Rotates the group around its centroid.
		 *
		 * @param {Number} amount Amount of rotation
		 */
		orbit(amount) {
			if (this.p.frameCount == 0) console.warn('group.orbit is experimental and is subject to change in the future!');
			if (!this.centroid) this.resetCentroid();
			this._orbitAngle += amount;
			let angle = this._orbitAngle;
			for (let s of this) {
				if (s.distCentroid === undefined) this.resetDistancesFromCentroid();
				let x = s.distCentroid.x;
				let y = s.distCentroid.y;
				let x2 = x * this.p.cos(angle) - y * this.p.sin(angle);
				let y2 = x * this.p.sin(angle) + y * this.p.cos(angle);
				x2 += this.centroid.x;
				y2 += this.centroid.y;
				s.vel.x = (x2 - s.x) * 0.1 * s.tileSize;
				s.vel.y = (y2 - s.y) * 0.1 * s.tileSize;
			}
		}

		/**
		 * Gets the member at index i.
		 *
		 * @deprecated get
		 * @param {Number} i The index of the object to retrieve
		 */
		get(i) {
			console.warn('Deprecated: use group[i] instead of group.get(i)');
			return this[i];
		}

		/**
		 * Its better to use the group Sprite constructor instead.
		 * `new group.Sprite()` which both creates a group sprite using
		 * soft inheritance and adds it to the group.
		 *
		 * Adds a sprite or multiple sprites to the group, whether they were
		 * already in the group or not, just like with the Array.push()
		 * method. Only sprites can be added to a group.
		 *
		 * @param {Sprite} sprites The sprite or sprites to be added
		 * @returns {Number} the new length of the group
		 */
		push(...sprites) {
			for (let s of sprites) {
				if (!(s instanceof this.p.Sprite)) {
					throw new Error('you can only add sprites to a group, no ' + typeof s + 's');
				}

				super.push(s);
				if (this.parent) this.p.p5play.groups[this.parent].push(s);
				s.groups.push(this);
			}
			return this.length;
		}

		/**
		 * Alias for group.length
		 * @deprecated
		 */
		size() {
			return this.length;
		}

		/**
		 * Returns the group's unique identifier.
		 *
		 * @returns {String} groupID
		 */
		toString() {
			return 'g' + this.idNum;
		}

		/**
		 * Remove sprites that go outside the given culling boundary
		 * relative to the camera.
		 *
		 * @param {Number} top|size The distance that sprites can move below the p5.js canvas before they are removed. *OR* The distance sprites can travel outside the screen on all sides before they get removed.
		 * @param {Number} bottom|cb The distance that sprites can move below the p5.js canvas before they are removed.
		 * @param {Number} [left] The distance that sprites can move beyond the left side of the p5.js canvas before they are removed.
		 * @param {Number} [right] The distance that sprites can move beyond the right side of the p5.js canvas before they are removed.
		 * @param {Function} [cb(sprite)] The callback is given the sprite that
		 * passed the cull boundary, if no callback is given the sprite is
		 * removed by default
		 * @return {Number} The number of sprites culled
		 */
		cull(top, bottom, left, right, cb) {
			if (left === undefined) {
				let size = top;
				cb = bottom;
				top = bottom = left = right = size;
			}
			if (isNaN(top) || isNaN(bottom) || isNaN(left) || isNaN(right)) {
				throw new TypeError('The culling boundary must be defined with numbers');
			}
			if (cb && typeof cb != 'function') {
				throw new TypeError('The callback to group.cull must be a function');
			}

			let cx = this.p.camera.x - this.p.world.hw / this.p.camera.zoom;
			let cy = this.p.camera.y - this.p.world.hh / this.p.camera.zoom;

			let minX = -left + cx;
			let minY = -top + cy;
			let maxX = this.p.width + right + cx;
			let maxY = this.p.height + bottom + cy;

			let culled = 0;
			for (let i = 0; i < this.length; i++) {
				let s = this[i];
				if (s.x < minX || s.y < minY || s.x > maxX || s.y > maxY) {
					culled++;
					if (cb) cb(s, culled);
					else s.remove();
					if (s.removed) i--;
				}
			}
			return culled;
		}

		/**
		 * If no input is given all sprites in the group are removed.
		 *
		 * If a sprite or index is given, that sprite is removed from the
		 * group, but not from the sketch or any other groups it may be in.
		 *
		 * @param {Sprite} item The sprite to be removed
		 * @return {Sprite} the removed sprite
		 */
		remove(item) {
			if (item === undefined) {
				while (this.length > 0) {
					this[0].remove();
				}
				return;
			}

			let idx;
			if (typeof item == 'number') {
				if (item >= 0) idx = item;
				else idx = this.length + item;
			} else {
				idx = this.indexOf(item);
			}

			if (idx != -1) {
				let s = this[idx];
				if (!s.removed) {
					let gIdx = s.groups.findIndex((g) => g._uid == this._uid);
					s.groups.splice(gIdx, 1);
				}
				this.splice(idx, 1);
				return s;
			}
			throw new Error('Sprite not found in group');
		}

		/**
		 * Removes all sprites from the group and destroys the group.
		 *
		 */
		removeAll() {
			this.remove();
		}

		/**
		 * Draws all the sprites in the group.
		 *
		 */
		draw() {
			let g = [...this];
			g.sort((a, b) => a.layer - b.layer);
			for (let i = 0; i < g.length; i++) {
				let sprite = g[i];
				if (sprite.life-- < 0) {
					sprite.remove();
					g.splice(i, 1);
					i--;
					continue;
				}
				if (sprite.visible && (!this.p.p5play._inPostDraw || sprite.autoDraw)) {
					sprite.draw();
				}
			}
			if (this._autoDraw) this._autoDraw = null;
		}

		/**
		 * Updates all the sprites in the group. See sprite.update for
		 * more information.
		 *
		 * By default, allSprites.update is called after every draw call.
		 *
		 */
		update() {
			for (let s of this) {
				if (!this.p.p5play._inPostDraw || this.autoUpdate) {
					s.update();
				}
			}
			if (this._autoUpdate) this._autoUpdate = null;
		}
	};

	/**
	 * Adds an animation to the sprite. Use this function in the preload p5.js
	 * function. You don't need to name the animation if the sprite will only
	 * use one animation. See SpriteAnimation for more information.
	 *
	 * @memberof Sprite
	 * @instance
	 * @func addAnimation
	 * @param {String} name SpriteAnimation identifier
	 * @param {SpriteAnimation} animation The preloaded animation
	 * @example
	 * sprite.addAni(name, animation);
	 * sprite.addAni(name, frame1, frame2, frame3...);
	 * sprite.addAni(name, atlas);
	 */
	this.Sprite.prototype.addAnimation =
		this.Group.prototype.addAnimation =
		this.Sprite.prototype.addAni =
		this.Group.prototype.addAni =
		this.Sprite.prototype.addImage =
		this.Group.prototype.addImage =
		this.Sprite.prototype.addImg =
		this.Group.prototype.addImg =
			function () {
				let args = [...arguments];
				let name, ani;
				if (args[0] instanceof this.p.SpriteAnimation) {
					ani = args[0];
					name = ani.name || 'default';
					ani.name = name;
				} else if (args[1] instanceof this.p.SpriteAnimation) {
					name = args[0];
					ani = args[1];
					ani.name = name;
				} else {
					ani = new this.p.SpriteAnimation(this, ...args);
					name = ani.name;
				}
				this.animations[name] = ani;
				this._ani = ani;

				// only works if the animation was loaded in preload
				if (this._dimensionsUndefinedByUser && (ani.w != 1 || ani.h != 1)) {
					this.w = ani.w;
					this.h = ani.h;
				}
				return ani;
			};

	/**
	 * Add multiple animations
	 *
	 * @memberof Sprite
	 * @instance
	 */
	this.Sprite.prototype.addAnis =
		this.Group.prototype.addAnis =
		this.Sprite.prototype.addAnimations =
		this.Group.prototype.addAnimations =
		this.Sprite.prototype.addImages =
		this.Group.prototype.addImages =
		this.Sprite.prototype.addImgs =
		this.Group.prototype.addImgs =
			function () {
				let args = arguments;
				let atlases;
				if (args.length == 1) {
					atlases = args[0];
				} else {
					this.spriteSheet = args[0];
					atlases = args[1];
				}
				for (let name in atlases) {
					let atlas = atlases[name];
					this.addAni(name, atlas);
				}
			};

	this.World = class extends pl.World {
		/**
		 * <a href="https://p5play.org/learn/world.html">
		 * Look at the World reference pages before reading these docs.
		 * </a>
		 *
		 * A `world` object is created automatically by p5play. There can only
		 * be one world per p5.js instance.
		 *
		 * This class extends `planck.World` and adds some p5play specific
		 * features.
		 */
		constructor() {
			super(new pl.Vec2(0, 0), true);
			this.p = pInst;
			this._offset = { x: 0, y: 0 };
			let _this = this;
			this.offset = {
				get x() {
					return _this._offset.x;
				},
				set x(val) {
					_this._offset.x = val || 0;
					_this.resize();
				},
				get y() {
					return _this._offset.y;
				},
				set y(val) {
					_this._offset.y = val || 0;
					_this.resize();
				}
			};
			this.resize();
			this.contacts = [];

			this.on('begin-contact', this._beginContact);
			this.on('end-contact', this._endContact);

			/**
			 * Gravity force that affects all dynamic physics colliders.
			 *
			 * @type.x
			 */
			/**
			 * Gravity force that affects all dynamic physics colliders.
			 *
			 * @type.y
			 */
			this.gravity = {
				get x() {
					return _this.m_gravity.x;
				},
				set x(val) {
					for (let s of _this.p.allSprites) {
						s.sleeping = false;
					}
					_this.m_gravity.x = _this.p.round(val || 0);
				},
				get y() {
					return _this.m_gravity.y;
				},
				set y(val) {
					for (let s of _this.p.allSprites) {
						s.sleeping = false;
					}
					_this.m_gravity.y = _this.p.round(val || 0);
				}
			};

			this.velocityThreshold = 0.19;

			this.mouseTracking ??= true;
			this.mouseSprite = null;
			this.mouseSprites = [];

			this.autoStep = true;
		}

		/**
		 * The lowest velocity an object can have before it is considered
		 * to be at rest.
		 *
		 * Adjust the velocity threshold to allow for slow moving objects
		 * but don't have it be too low, or else objects will never sleep.
		 *
		 * @type {number}
		 * @default 0.19
		 */
		get velocityThreshold() {
			return this._velocityThreshold;
		}

		set velocityThreshold(val) {
			pl.Settings.velocityThreshold = val;
			this._velocityThreshold = val;
		}

		/**
		 * Resizes the world to the given width and height. Used when
		 * the canvas is created or resized.
		 *
		 * @private
		 */
		resize(w, h) {
			w ??= this.p.width;
			h ??= this.p.height;
			this.origin = {
				x: w * 0.5 - this.offset.x,
				y: h * 0.5 - this.offset.y
			};
			if (this.p.allSprites.tileSize != 1) {
				this.origin.x -= this.p.allSprites.tileSize * 0.5;
				this.origin.y -= this.p.allSprites.tileSize * 0.5;
			}
			this.hw = w * 0.5;
			this.hh = h * 0.5;
		}

		/**
		 * Performs a physics simulation step that advances all sprites'
		 * forward in time by 1/60th of a second if no timeStep is given.
		 *
		 * This function is automatically called at the end of the p5.js draw
		 * loop, unless it was already called inside the draw loop.
		 *
		 * @param {Number} timeStep - time step in seconds
		 * @param {Number} velocityIterations
		 * @param {Number} positionIterations
		 */
		step(timeStep, velocityIterations, positionIterations) {
			for (let s of this.p.allSprites) {
				s.prevPos.x = s.x;
				s.prevPos.y = s.y;
			}
			super.step(timeStep || 1 / (this.p._targetFrameRate || 60), velocityIterations || 8, positionIterations || 3);
			let sprites = Object.values(this.p.p5play.sprites);
			for (let s of sprites) {
				s._step();
			}
			if (this.autoStep) this.autoStep = null;
		}

		/**
		 * Returns the sprites at a position.
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @returns {Array} an array of sprites
		 */
		getSpritesAt(x, y, group, cameraActiveWhenDrawn) {
			cameraActiveWhenDrawn ??= true;
			const convertedPoint = new pl.Vec2(x / plScale, y / plScale);
			const aabb = new pl.AABB();
			aabb.lowerBound = new pl.Vec2(convertedPoint.x - 0.001, convertedPoint.y - 0.001);
			aabb.upperBound = new pl.Vec2(convertedPoint.x + 0.001, convertedPoint.y + 0.001);

			// Query the world for overlapping shapes.
			let fxts = [];
			this.queryAABB(aabb, (fxt) => {
				if (fxt.getShape().testPoint(fxt.getBody().getTransform(), convertedPoint)) {
					fxts.push(fxt);
				}
				return true;
			});

			group ??= this.p.allSprites;

			let sprites = [];
			if (fxts.length > 0) {
				for (let s of group) {
					if (!s.body) continue;
					if (fxts.includes(s.body.m_fixtureList)) {
						if (s._cameraActiveWhenDrawn == cameraActiveWhenDrawn) sprites.push(s);
					}
				}
			}
			return sprites;
		}

		/**
		 * Returns the sprite at the top most layer position where
		 * the mouse click occurs
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @returns {Sprite} a sprite
		 */
		getSpriteAt(x, y, group) {
			let sprites = this.getSpritesAt(x, y, group);
			sprites.sort((a, b) => (a.layer - b.layer) * -1);
			return sprites[0];
		}

		_beginContact(contact) {
			// Get both fixtures
			let a = contact.m_fixtureA;
			let b = contact.m_fixtureB;
			let t = '_collisions';
			if (a.m_isSensor) t = '_overlappers';
			a = a.m_body.sprite;
			b = b.m_body.sprite;

			a[t][b._uid] = 0;
			b[t][a._uid] = 0;

			for (let g of b.groups) {
				if (!a[t][g._uid] || a[t][g._uid] < 0) {
					g[t][a._uid] = 0;
					a[t][g._uid] = 0;
				}
			}

			for (let g of a.groups) {
				if (!b[t][g._uid] || b[t][g._uid] < 0) {
					g[t][b._uid] = 0;
					b[t][g._uid] = 0;
				}
				for (let g2 of b.groups) {
					if (!g[t][g2._uid] || g[t][g2._uid] < 0) {
						g[t][g2._uid] = 0;
						g2[t][g._uid] = 0;
					}
				}
			}
		}

		_endContact(contact) {
			let a = contact.m_fixtureA;
			let b = contact.m_fixtureB;
			let contactType = '_collisions';
			if (a.m_isSensor) contactType = '_overlappers';
			a = a.m_body.sprite;
			b = b.m_body.sprite;

			a[contactType][b._uid] = -2;
			b[contactType][a._uid] = -2;

			for (let g of b.groups) {
				let inContact = false;
				for (let s of g) {
					if (s[contactType][a._uid] >= 0) {
						inContact = true;
						break;
					}
				}
				if (!inContact) {
					g[contactType][a._uid] = -2;
					a[contactType][g._uid] = -2;
				}
			}

			for (let g of a.groups) {
				let inContact = false;
				for (let s of g) {
					if (s[contactType][b._uid] >= 0) {
						inContact = true;
						break;
					}
				}
				if (!inContact) {
					g[contactType][b._uid] = -2;
					b[contactType][g._uid] = -2;
					for (let g2 of b.groups) {
						g[contactType][g2._uid] = -2;
						g2[contactType][g._uid] = -2;
					}
				}
			}
		}

		/**
		 * Used internally to find a contact callback between two sprites.
		 *
		 * @private
		 * @param {String} type "collide" or "overlap"
		 * @param {Sprite} s0
		 * @param {Sprite} s1
		 * @returns contact cb if one can be found between the two sprites
		 */
		_findContactCB(type, s0, s1) {
			let cb = s0[type][s1._uid];
			if (cb) return cb;

			let s1IsSprite = s1 instanceof this.p.Sprite;

			if (s1IsSprite) {
				for (let g1 of s1.groups) {
					cb = s0[type][g1._uid];
					if (cb) return cb;
				}
			}

			if (s0 instanceof this.p.Sprite) {
				for (let g0 of s0.groups) {
					cb = g0[type][s1._uid];
					if (cb) return cb;
					if (s1IsSprite) {
						for (let g1 of s1.groups) {
							cb = g0[type][g1._uid];
							if (cb) return cb;
						}
					}
				}
			}
			return false;
		}

		/**
		 * "Sleeping" sprites get temporarily ignored during physics
		 * simulation. A sprite starts "sleeping" when it stops moving and
		 * doesn't collide with anything that it wasn't already touching.
		 *
		 * This is a performance optimization that can be disabled for
		 * every sprite in the world.
		 *
		 * @type {Boolean}
		 * @default true
		 */
		get allowSleeping() {
			return this.getAllowSleeping();
		}

		set allowSleeping(val) {
			this.setAllowSleeping(val);
		}
	};

	this.Camera = class {
		/**
		 * <a href="https://p5play.org/learn/camera.html">
		 * Look at the Camera reference pages before reading these docs.
		 * </a>
		 *
		 * A `camera` object is created automatically when p5play loads.
		 * Currently, there can only be one camera per p5.js instance.
		 *
		 * A camera facilitates scrolling and zooming for scenes extending beyond
		 * the canvas. A camera has a position, a zoom factor, and the mouse
		 * coordinates relative to the view.
		 * The camera is automatically created on the first draw cycle.
		 *
		 * In p5.js terms the camera wraps the whole drawing cycle in a
		 * transformation matrix but it can be disable anytime during the draw
		 * cycle for example to draw interface elements in an absolute position.
		 *
		 * @param {Number} x Initial x coordinate
		 * @param {Number} y Initial y coordinate
		 * @param {Number} zoom magnification
		 */
		constructor(x, y, zoom) {
			this.p = pInst;
			let _this = this;

			// camera position
			this._pos = { x: 0, y: 0 };

			// camera translation
			this.__pos = { x: 0, y: 0 };

			/**
			 * Get the translated mouse position relative to the camera view.
			 * Offsetting and scaling the canvas will not change the sprites' position
			 * nor the mouseX and mouseY variables. Use this property to read the mouse
			 * position if the camera moved or zoomed.
			 *
			 * @type {Object}
			 */
			this.mouse = {
				x: this.p.mouseX,
				y: this.p.mouseY
			};
			/**
			 * @type.x {Number}
			 */
			/**
			 * @type.y {Number}
			 */

			/**
			 * True if the camera is active.
			 * Read only property. Use the methods Camera.on() and Camera.off()
			 * to enable or disable the camera.
			 *
			 * @type {Boolean}
			 * @default false
			 */
			this.active = false;

			this.bound = {
				min: { x: 0, y: 0 },
				max: { x: 0, y: 0 }
			};

			this._zoomIdx = -1;

			this._zoom = zoom || 1;
			this.x = x || 0;
			this.y = y || 0;
		}

		/**
		 * The camera's position. {x, y}
		 *
		 * @type {Object}
		 */
		get pos() {
			return this._pos;
		}
		/**
		 * The camera's position. Alias for pos.
		 *
		 * @type {Object}
		 */
		get position() {
			return this._pos;
		}

		/**
		 * The camera x position.
		 *
		 * @type {Number}
		 */
		get x() {
			return this._pos.x;
		}
		set x(val) {
			this._pos.x = val;
			let x = -val + this.p.world.hw / this._zoom;
			if (this.p.allSprites.pixelPerfect) x = Math.round(x);
			this.__pos.x = x;

			this.bound.min.x = val - this.p.world.hw / this._zoom - 100;
			this.bound.max.x = val + this.p.world.hw / this._zoom + 100;
		}

		/**
		 * The camera y position.
		 *
		 * @type {Number}
		 */
		get y() {
			return this._pos.y;
		}
		set y(val) {
			this._pos.y = val;
			let y = -val + this.p.world.hh / this._zoom;
			if (this.p.allSprites.pixelPerfect) y = Math.round(y);
			this.__pos.y = y;

			this.bound.min.y = val - this.p.world.hh / this._zoom - 100;
			this.bound.max.y = val + this.p.world.hh / this._zoom + 100;
		}

		/**
		 * Camera zoom.
		 *
		 * A scale of 1 will be the normal size. Setting it to 2 will
		 * make everything twice the size. .5 will make everything half
		 * size.
		 *
		 * @type {Number}
		 * @default 1
		 */
		get zoom() {
			return this._zoom;
		}
		set zoom(val) {
			this._zoom = val;
			let x = -this._pos.x + this.p.world.hw / val;
			let y = -this._pos.y + this.p.world.hh / val;
			if (this.p.allSprites.pixelPerfect) {
				x = Math.round(x);
				y = Math.round(y);
			}
			this.__pos.x = x;
			this.__pos.y = y;
		}

		/**
		 * Zoom the camera at a given speed.
		 *
		 * @param {Number} target The target zoom.
		 * @param {Number} speed The amount of zoom per frame.
		 * @returns {Promise} A promise that resolves when the camera reaches the target zoom.
		 */
		zoomTo(target, speed) {
			if (target == this._zoom) return Promise.resolve(true);
			speed ??= 0.1;
			let delta = Math.abs(target - this._zoom);
			let frames = Math.round(delta / speed);
			if (target < this.zoom) speed = -speed;

			this._zoomIdx++;
			let zoomIdx = this._zoomIdx;
			return (async () => {
				for (let i = 0; i < frames; i++) {
					if (zoomIdx != this._zoomIdx) return false;
					this.zoom += speed;
					await this.p.delay();
				}
				this.zoom = target;
				return true;
			})();
		}

		/**
		 * Activates the camera.
		 * The canvas will be drawn according to the camera position and scale until
		 * camera.off() is called
		 *
		 */
		on() {
			if (!this.active) {
				this.p.push();
				this.p.scale(this._zoom);
				this.p.translate(this.__pos.x, this.__pos.y);
				this.active = true;
			}
		}

		/**
		 * Deactivates the camera.
		 * The canvas will be drawn normally, ignoring the camera's position
		 * and scale until camera.on() is called
		 *
		 */
		off() {
			if (this.active) {
				this.p.pop();
				this.active = false;
			}
		}
	}; //end camera class

	/**
	 * This planck function should've been named "shouldContact",
	 * because that's what it actually decides.
	 *
	 * Here we override it to allow for overlap events between sprites.
	 */
	pl.Fixture.prototype.shouldCollide = function (that) {
		// should this and that produce a contact event?
		let a = this;
		let b = that;

		// sensors overlap (returning true doesn't mean they will collide it means
		// they're included in begin contact and end contact events)
		if (a.m_isSensor && b.m_isSensor) return true;
		// ignore contact events between a sensor and a non-sensor
		if (a.m_isSensor || b.m_isSensor) return false;
		// else test if the two non-sensor colliders should overlap

		a = a.m_body.sprite;
		b = b.m_body.sprite;

		// if `a` has an overlap enabled with `b` their colliders should not produce a
		// contact event, the overlap contact event is between their sensors
		let shouldOverlap = a.p.world._findContactCB('_overlap', a, b);
		if (!shouldOverlap) shouldOverlap = a.p.world._findContactCB('_overlap', b, a);
		if (shouldOverlap) return false;
		return true;
	};

	this.Tiles = class {
		/**
		 * <a href="https://p5play.org/learn/tiles.html">
		 * Look at the Tiles reference pages before reading these docs.
		 * </a>
		 *
		 * @param {String} tiles
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} w
		 * @param {Number} h
		 */
		constructor(tiles, x, y, w, h) {
			if (typeof tiles == 'string') tiles = tiles.split('\n');

			x ??= 0;
			y ??= 0;
			w ??= 1;
			h ??= 1;

			for (let row = 0; row < tiles.length; row++) {
				for (let col = 0; col < tiles[row].length; col++) {
					let t = tiles[row][col];
					if (t == ' ' || t == '.') continue;
					let ani, g;
					let groups = Object.values(pInst.p5play.groups);
					for (g of groups) {
						ani = g.animations[t];
						if (ani) break;
					}
					if (ani) {
						new g.Sprite(ani, x + col * w, y + row * h);
						continue;
					}
					let wasFound = false;
					for (g of groups) {
						if (g.tile == t) {
							wasFound = true;
							break;
						}
					}
					if (wasFound) {
						new g.Sprite(x + col * w, y + row * h);
						continue;
					}
					let s;
					for (s of pInst.allSprites) {
						if (s.tile == t) {
							wasFound = true;
							break;
						}
					}
					if (wasFound) {
						s.x = x + col * w;
						s.y = y + row * h;
						continue;
					}
					throw 'Tile not found: ' + t;
				}
			}
		}
	};

	/**
	 * Use of `new Tiles()` is preferred.
	 *
	 * @deprecated
	 * @func createTiles
	 */
	this.createTiles = function (tiles, x, y, w, h) {
		return new this.Tiles(tiles, x, y, w, h);
	};

	class Scale {
		constructor() {
			let _this = this;
			Object.defineProperties(this, {
				x: {
					get() {
						return _this._x;
					},
					set(val) {
						if (val == _this._x) return;
						_this._x = val;
						_this._avg = (_this._x + _this._y) * 0.5;
					},
					configurable: true,
					enumerable: true
				},
				y: {
					get() {
						return _this._y;
					},
					set(val) {
						if (val == _this._y) return;
						_this._y = val;
						_this._avg = (_this._x + _this._y) * 0.5;
					},
					configurable: true,
					enumerable: true
				},
				_x: {
					value: 1,
					enumerable: false,
					writable: true
				},
				_y: {
					value: 1,
					enumerable: false,
					writable: true
				},
				_avg: {
					value: 1,
					enumerable: false,
					writable: true
				}
			});
		}

		valueOf() {
			return this._avg;
		}
	}

	/**
	 * Deprecated. Use world.step and allSprites.update instead.
	 *
	 * @deprecated
	 * @func updateSprites
	 */
	this.updateSprites = function () {
		if (this.frameCount == 1) console.warn('updateSprites() is deprecated, use world.step() instead.');
		this.world.step(...arguments);
		this.allSprites.update();
	};

	// TODO implement planck joints
	// the following code is from https://github.com/bobcgausa/cook-js

	// const debugDraw = (canvas, scale, world) => {
	// 	const context = canvas.getContext('2d');
	// 	//context.fillStyle = '#DDD';
	// 	//context.fillRect(0, 0, canvas.width, canvas.height);

	// 	// Draw joints
	// 	for (let j = world.m_jointList; j; j = j.m_next) {
	// 		context.lineWidth = 0.25;
	// 		context.strokeStyle = '#00F';
	// 		drawJoint(context, scale, world, j);
	// 	}
	// };

	// const drawJoint = (context, scale, world, joint) => {
	// 	context.save();
	// 	context.scale(scale, scale);
	// 	context.lineWidth /= scale;

	// 	const b1 = joint.m_bodyA;
	// 	const b2 = joint.m_bodyB;
	// 	const x1 = b1.getPosition();
	// 	const x2 = b2.getPosition();
	// 	let p1;
	// 	let p2;
	// 	context.beginPath();
	// 	switch (joint.m_type) {
	// 		case 'distance-joint':
	// 		case 'rope-joint':
	// 			context.moveTo(x1.x, x1.y);
	// 			context.lineTo(x2.x, x2.y);
	// 			break;
	// 		case 'wheel-joint':
	// 		case 'revolute-joint':
	// 			p1 = joint.m_localAnchorA;
	// 			p2 = joint.m_localAnchorB;
	// 			const a = b2.getAngle();
	// 			const v = new pl.Vec2(cos(a), sin(a));
	// 			context.moveTo(x2.x, x2.y);
	// 			context.lineTo(x2.x + v.x, x2.y + v.y);
	// 			break;
	// 		case 'mouse-joint':
	// 		case 'weld-joint':
	// 			p1 = joint.getAnchorA();
	// 			p2 = joint.getAnchorB();
	// 			context.moveTo(p1.x, p1.y);
	// 			context.lineTo(p2.x, p2.y);
	// 			break;
	// 		case 'pulley-joint':
	// 			p1 = joint.m_groundAnchorA;
	// 			p2 = joint.m_groundAnchorB;
	// 			context.moveTo(p1.x, p1.y);
	// 			context.lineTo(x1.x, x1.y);
	// 			context.moveTo(p2.x, p2.y);
	// 			context.lineTo(x2.x, x2.y);
	// 			context.moveTo(p1.x, p1.y);
	// 			context.lineTo(p2.x, p2.y);
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// 	context.closePath();
	// 	context.stroke();
	// 	context.restore();
	// };

	// function getAABB(body) {
	// 	const aabb = new pl.AABB();
	// 	const t = new pl.Transform();
	// 	t.setIdentity();
	// 	const shapeAABB = new pl.AABB();
	// 	aabb.lowerBound = new pl.Vec2(1000000, 1000000);
	// 	aabb.upperBound = new pl.Vec2(-1000000, -1000000);
	// 	let fixture = body.body.getFixtureList();
	// 	while (fixture) {
	// 		const shape = fixture.getShape();
	// 		const childCount = shape.getChildCount(); //only for chains
	// 		for (let child = 0; child < childCount; ++child) {
	// 			shape.computeAABB(shapeAABB, body.body.m_xf, child);
	// 			unionTo(aabb, shapeAABB);
	// 		}
	// 		fixture = fixture.getNext();
	// 	}
	// 	aabb.lowerBound.mul(plScale); //upper left, offset from center
	// 	aabb.upperBound.mul(plScale); //lower right
	// 	return aabb;
	// }

	// function unionTo(a, b) {
	// 	a.lowerBound.x = min(a.lowerBound.x, b.lowerBound.x);
	// 	a.lowerBound.y = min(a.lowerBound.y, b.lowerBound.y);
	// 	a.upperBound.x = max(a.upperBound.x, b.upperBound.x);
	// 	a.upperBound.y = max(a.upperBound.y, b.upperBound.y);
	// }

	// The ray cast collects multiple hits along the ray in ALL mode.
	// The fixtures are not necessary reported in order.
	// We might not capture the closest fixture in ANY.
	// const rayCast = (() => {
	// 	let def = {
	// 		ANY: 0,
	// 		NEAREST: 2,
	// 		ALL: 1
	// 	};

	// 	const reset = (mode, ignore) => {
	// 		def.points = [];
	// 		def.normals = [];
	// 		def.fixtures = [];
	// 		def.fractions = [];
	// 		def.ignore = ignore || [];
	// 		def.mode = mode == undefined ? def.NEAREST : mode;
	// 	};

	// 	def.rayCast = (point1, point2, mode, ignore) => {
	// 		reset(mode, ignore);
	// 		world.rayCast(scaleTo(point1), scaleTo(point2), def.callback);
	// 	};

	// 	def.callback = (fixture, point, normal, fraction) => {
	// 		if (def.ignore.length > 0) for (let i = 0; i < def.ignore.length; i++) if (def.ignore[i] === fixture) return -1;
	// 		if (def.mode == def.NEAREST && def.points.length == 1) {
	// 			def.fixtures[0] = fixture;
	// 			def.points[0] = scaleFrom(point);
	// 			def.normals[0] = normal;
	// 			def.fractions[0] = fraction;
	// 		} else {
	// 			def.fixtures.push(fixture);
	// 			def.points.push(scaleFrom(point));
	// 			def.normals.push(normal);
	// 			def.fractions.push(fraction);
	// 		}
	// 		// -1 to ignore a fixture and continue
	// 		//  0 to terminate on first hit, or for searching
	// 		//  fraction seems to return nearest fixture as last entry in array
	// 		// +1 returns multiple but mix of low high or high low
	// 		return def.mode == def.NEAREST ? fraction : def.mode;
	// 	};

	// 	return def;
	// })();

	// const queryAABB = (() => {
	// 	let def = {};
	// 	function reset(search) {
	// 		def.fixtures = [];
	// 		def.search = search || [];
	// 	}

	// 	def.query = ({ lowerBound, upperBound }, search) => {
	// 		reset(search);
	// 		aabbc = new pl.AABB(lowerBound.mul(1 / plScale), upperBound.mul(1 / plScale));
	// 		world.queryAABB(aabbc, def.callback);
	// 	};

	// 	def.callback = (fixture) => {
	// 		def.fixtures.push(fixture);
	// 		return true;
	// 	};

	// 	return def;
	// })();

	this.p5play.palettes ??= [
		{
			a: 'aqua',
			b: 'black',
			c: 'crimson',
			d: 'dark blue',
			// e
			f: 'fuchsia',
			g: 'green',
			h: 'hot pink',
			i: 'blue', // indigo
			// j
			k: 'black',
			l: 'lavender',
			m: 'magenta',
			n: 'brown',
			o: 'orange',
			p: 'pink',
			// q
			r: 'red',
			s: 'sky blue',
			t: 'turquoise',
			u: 'blue',
			v: 'violet',
			w: 'white',
			// x
			y: 'yellow'
			// z
		}
	];

	/**
	 * Gets a color from a color palette
	 *
	 * @func colorPal
	 * @param {String} c A single character, a key found in the color palette object.
	 * @param {Number|Object} palette Can be a palette object or number index
	 * in the system's palettes array.
	 * @returns a hex color string for use by p5.js functions
	 */
	this.colorPal = (c, palette) => {
		if (c instanceof p5.Color) return c;
		if (typeof palette == 'number') {
			palette = pInst.p5play.palettes[palette];
		}
		palette ??= pInst.p5play.palettes[0];
		let clr;
		if (palette) clr = palette[c];
		// if transparent
		if (clr === '' || c === '.' || c === ' ') {
			return pInst.color(0, 0, 0, 0);
		}
		return pInst.color(clr || c);
	};

	/**
	 * Create pixel art images from a string. Each character in the
	 * input string represents a color value defined in the palette
	 * object.
	 *
	 * @func spriteArt
	 * @param {String} txt Each character represents a pixel color value
	 * @param {Number} scale The scale of the image
	 * @param {Number|Object} palette Color palette
	 * @returns A p5.js Image
	 *
	 * @example
	 * let str = `
	 * ...yyyy
	 * .yybyybyy
	 * yyyyyyyyyy
	 * yybyyyybyy
	 * .yybbbbyy
	 * ...yyyy`;
	 *
	 * let img = spriteArt(str);
	 */
	this.spriteArt = (txt, scale, palette) => {
		scale ??= 1;
		if (typeof palette == 'number') {
			palette = pInst.p5play.palettes[palette];
		}
		palette ??= pInst.p5play.palettes[0];
		let lines = txt; // accepts 2D arrays of characters
		if (typeof txt == 'string') {
			txt = txt.trim();
			txt = txt.replace(/\r*\n\t+/g, '\n'); // trim leading tabs
			txt = txt.replace(/\s+$/g, ''); // trim trailing whitespace
			lines = txt.split('\n');
		}
		let w = 0;
		for (let line of lines) {
			if (line.length > w) w = line.length;
		}
		let h = lines.length;
		let img = pInst.createImage(w * scale, h * scale);
		img.loadPixels();

		for (let i = 0; i < lines.length; i++) {
			for (let j = 0; j < lines[i].length; j++) {
				for (let sX = 0; sX < scale; sX++) {
					for (let sY = 0; sY < scale; sY++) {
						let c = this.colorPal(lines[i][j], palette);
						img.set(j * scale + sX, i * scale + sY, c);
					}
				}
			}
		}
		img.updatePixels();
		img.w = img.width;
		img.h = img.height;
		pInst.p5play.images.onLoad(img);
		return img; // return the p5 graphics object
	};

	/**
	 * Deprecated, use sprite.draw() instead.
	 *
	 * allSprites.draw() is run automatically at the end of the p5.js
	 * draw loop, unless a sprite or group is drawn separately within the
	 * draw loop.
	 *
	 * @deprecated
	 */
	this.drawSprite = function (sprite) {
		if (this.frameCount == 1) console.warn('drawSprite() is deprecated, use sprite.draw() instead.');
		sprite.draw();
	};

	/**
	 * Deprecated, use group.draw() instead.
	 *
	 * allSprites.draw() is run automatically at the end of the p5.js
	 * draw loop, unless a sprite or group is drawn separately within the
	 * draw loop.
	 *
	 * @deprecated
	 */
	this.drawSprites = function (group) {
		if (this.frameCount == 1) console.warn('drawSprites() is deprecated, use group.draw() instead.');
		group ??= this.allSprites;
		group.draw();
	};

	/**
	 * Use of `new Sprite()` is preferred.
	 *
	 * Creates a new sprite.
	 *
	 * @deprecated
	 * @returns {Sprite}
	 */
	this.createSprite = function () {
		return new this.Sprite(...arguments);
	};

	/**
	 * Use of `new Group()` is preferred.
	 *
	 * Creates a new group of sprites.
	 *
	 * @deprecated
	 * @returns {Group}
	 */
	this.createGroup = function () {
		return new this.Group(...arguments);
	};

	/**
	 * Alias for `new SpriteAnimation()`
	 *
	 * Load animations in the preload p5.js function if you need to use
	 * them when your program starts.
	 *
	 * @returns {SpriteAnimation}
	 */
	/**
	 * Alias for `new SpriteAnimation()`
	 *
	 * @returns {SpriteAnimation}
	 */
	this.loadAni = this.loadAnimation = function () {
		return new this.SpriteAnimation(...arguments);
	};

	/**
	 * Displays an animation. Similar to the p5.js image function.
	 *
	 * @param {SpriteAnimation} ani Animation to be displayed
	 * @param {Number} x position of the animation on the canvas
	 * @param {Number} y position of the animation on the canvas
	 * @param {Number} r rotation of the animation
	 * @param {Number} sX scale of the animation in the x direction
	 * @param {Number} sY scale of the animation in the y direction
	 */
	this.animation = function (ani, x, y, r, sX, sY) {
		if (ani.visible) ani.update();
		ani.draw(x, y, r, sX, sY);
	};

	/**
	 * Delay code execution in an async function for the specified time
	 * or if no input parameter is given, it waits for the next possible
	 * animation frame.
	 *
	 * @param {Number} millisecond
	 * @returns {Promise} A Promise that fulfills after the specified time.
	 *
	 * @example
	 * async function startGame() {
	 *   await delay(3000);
	 * }
	 */
	this.delay = (millisecond) => {
		if (!millisecond) {
			return new Promise(requestAnimationFrame);
		} else {
			// else it wraps setTimeout in a Promise
			return new Promise((resolve) => {
				setTimeout(resolve, millisecond);
			});
		}
	};

	/**
	 * Use of delay is preferred.
	 *
	 * @deprecated
	 */
	this.sleep = (millisecond) => {
		return this.delay(millisecond);
	};

	/**
	 * Awaitable function for playing sounds.
	 *
	 * @param {p5.Sound} sound
	 * @returns {Promise}
	 * @example
	 * await play(sound);
	 */
	this.play = (sound) => {
		if (!sound.play) throw new Error('Tried to play a sound but the sound is not a sound object: ' + sound);
		// TODO reject if sound not found
		return new Promise((resolve, reject) => {
			sound.play();
			sound.onended(() => resolve());
		});
	};

	this.p5play.playIntro = async function () {
		if (document.getElementById('p5play-intro')) return;
		pInst._incrementPreload();
		let p = document.createElement('div');
		p.id = 'p5play-intro';
		p.style = 'position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1000; background-color: black;';
		let logo = document.createElement('img');
		logo.src = 'https://p5play.org/v3/made_with_p5play.png';
		logo.style =
			'position: absolute; top: 50%; left: 50%; width: 40vh; height: 20vh; margin-left: -20vh; margin-top: -10vh; z-index: 1000; opacity: 0; transition: opacity 0.1s ease-in-out;';
		document.body.append(p);
		p.append(logo);
		await pInst.delay(100);
		logo.style.opacity = '1';
		logo.style.transition = 'scale 2s, opacity 0.4s ease-in-out';
		logo.style.scale = '1.1';
		await pInst.delay(1200);
		logo.style.opacity = '0';
		await pInst.delay(400);
		p.remove();
		pInst._decrementPreload();
	};

	{
		let lh = location.hostname;
		switch (lh) {
			case '127.0.0.1':
			case 'localhost':
			case 'p5play.org':
			case 'openprocessing.org':
			case 'preview.openprocessing.org':
			case 'editor.p5js.org':
			case 'codepen.io':
			case 'cdpn.io':
			case 'glitch.com':
			case 'replit.com':
			case 'stackblitz.com':
			case 'jsfiddle.net':
				break;
			default:
				if (
					lh.endsWith('stackblitz.io') ||
					lh.endsWith('glitch.me') ||
					lh.endsWith('repl.co') ||
					location.origin.endsWith('preview.p5js.org')
				) {
					break;
				}
				this.p5play.playIntro();
		}
	}

	let userDisabledP5Errors = p5.disableFriendlyErrors;
	p5.disableFriendlyErrors = true;

	/**
	 * p5.js canvas element. Use this property to get the canvas'
	 * width and height
	 * @property {p5.Canvas} canvas
	 * @property {Number} canvas.w the width of the canvas
	 * @property {Number} canvas.h the height of the canvas
	 */
	this.canvas = this.canvas;

	const _createCanvas = this.createCanvas;

	/**
	 * Use of `new Canvas()` is preferred.
	 *
	 * p5play adds some extra functionality to the p5.js createCanvas
	 * function.
	 *
	 * In p5play, a canvas can be created with an aspect ratio in the
	 * format `width:height`. For example `new Canvas('16:9')` will create
	 * the largest possible canvas with a 16:9 aspect ratio.
	 *
	 * This function also disables the default keydown responses for
	 * the arrow keys, slash, and spacebar. This is to prevent the
	 * browser from scrolling the page when the user is playing a game
	 * using common keyboard commands.
	 *
	 * @param {Number} width|ratio
	 * @param {Number} height
	 */
	this.createCanvas = function () {
		let args = [...arguments];
		let isFullScreen = false;
		let pixelated = false;
		let w, h, ratio;
		if (typeof args[0] == 'string') {
			if (args[0].includes(':')) ratio = args[0].split(':');
			else {
				args[2] = args[0];
				args[0] = undefined;
			}
			if (args[1] == 'fullscreen') isFullScreen = true;
		}
		if (!args[0]) {
			args[0] = window.innerWidth;
			args[1] = window.innerHeight;
			isFullScreen = true;
		} else if (typeof args[0] == 'number' && typeof args[1] != 'number') {
			args[2] = args[1];
			args[1] = args[0];
		}
		let scale;
		if (typeof args[2] == 'string') {
			args[2] = args[2].toLowerCase();
			if (args[2] != 'p2d' && args[2] != 'webgl') {
				args[2] = args[2].split(' ');
			}
			if (args[2][0] == 'pixelated') {
				pixelated = true;
				if (!args[2][1]) isFullScreen = true;
				else scale = Number(args[2][1].slice(1));
				ratio = [args[0], args[1]];
			}
			if (args[2][0] == 'fullscreen') {
				isFullScreen = true;
			}
		}
		if (ratio) {
			let rW = Number(ratio[0]);
			let rH = Number(ratio[1]);
			if (!scale) {
				w = window.innerWidth;
				h = window.innerWidth * (rH / rW);
				if (h > window.innerHeight) {
					w = window.innerHeight * (rW / rH);
					h = window.innerHeight;
				}
			} else {
				w = rW * scale;
				h = rH * scale;
			}
			w = Math.round(w);
			h = Math.round(h);

			if (!pixelated) {
				args[0] = w;
				args[1] = h;
			}
		}
		if (args.length < 3) args[2] = 'p2d';
		let can = _createCanvas.call(pInst, ...args);
		this.canvas.tabIndex = 0;
		this.canvas.w = args[0];
		this.canvas.h = args[1];
		this.canvas.addEventListener('keydown', function (e) {
			if (
				e.key == ' ' ||
				e.key == '/' ||
				e.key == 'ArrowUp' ||
				e.key == 'ArrowDown' ||
				e.key == 'ArrowLeft' ||
				e.key == 'ArrowRight'
			) {
				e.preventDefault();
			}
		});
		this.canvas.addEventListener('mouseover', () => {
			this.mouse.isOnCanvas = true;
			this.mouse.active = true;
		});
		this.canvas.addEventListener('mouseleave', () => {
			this.mouse.isOnCanvas = false;
		});
		this.canvas.addEventListener('touchstart', (e) => {
			e.preventDefault();
		});
		this.world.resize();
		if (!userDisabledP5Errors) p5.disableFriendlyErrors = false;

		/* prevent callout to copy image, etc when tap to hold */
		/* prevent webkit from resizing text to fit */
		/* prevent copy paste, to allow, change 'none' to 'text' */
		let style = `
canvas { 
	outline: none;
	-webkit-touch-callout: none;
	-webkit-text-size-adjust: none;
	-webkit-user-select: none;
	overscroll-behavior: none;
}
main{
	overscroll-behavior: none;
}`;
		if (isFullScreen) {
			style = 'html,\nbody,\n' + style;
			style += `
html, body {
	margin: 0;
	padding: 0;
	overflow: hidden;
	height: 100%;
}
main {
	margin: auto;
	display: flex;
	flex-wrap: wrap;
	align-content: center;
	justify-content: center;
	height: 100%;
}`;
		}
		if (pixelated) {
			style += `
canvas {
	image-rendering: pixelated;
	width: ${w}px!important;
	height: ${h}px!important;
}`;
		}
		let styleElem = document.createElement('style');
		styleElem.innerHTML = style;
		document.head.appendChild(styleElem);

		if (pixelated) {
			pInst.pixelDensity(1);
			pInst.noSmooth();
		}

		let idx = navigator.userAgent.indexOf('iPhone OS');
		if (idx > -1) {
			let version = navigator.userAgent.substring(idx + 10, idx + 12);
			this.p5play.version = version;
			if (version < 16) {
				pInst.pixelDensity(1);
			}
			this.p5play.os.platform = 'iOS';
			this.p5play.os.version = version;
		} else if (navigator.userAgentData !== undefined) {
			this.p5play.os.platform = navigator.userAgentData.platform;
		}

		return can;
	};

	/**
	 * Creates a p5.js canvas element. Includes some extra features such as
	 * a pixelated mode. See the Canvas learn page for more information.
	 *
	 */
	this.Canvas = function () {
		return pInst.createCanvas(...arguments);
	};

	const _background = this.background;

	/**
	 * Just like the p5.js background function except it also accepts
	 * a color pallette code.
	 */
	this.background = function () {
		let args = arguments;
		let c;
		if (args.length == 1 && (typeof args[0] == 'string' || args[0] instanceof p5.Color)) {
			c = this.colorPal(args[0]);
		}
		if (c !== undefined) _background.call(this, c);
		else _background.call(this, ...args);
	};

	const _fill = this.fill;

	/**
	 * Just like the p5.js fill function except it also accepts
	 * a color pallette code.
	 */
	this.fill = function () {
		let args = arguments;
		let c;
		if (args.length == 1) {
			c = this.colorPal(args[0]);
		}
		if (c !== undefined) _fill.call(this, c);
		else _fill.call(this, ...args);
	};

	const _stroke = this.stroke;

	/**
	 * Just like the p5.js stroke function except it also accepts
	 * a color pallette code.
	 */
	this.stroke = function () {
		let args = arguments;
		let c;
		if (args.length == 1) {
			c = this.colorPal(args[0]);
		}
		if (c !== undefined) _stroke.call(this, c);
		else _stroke.call(this, ...args);
	};

	// images is a cache of loaded/loading images, to prevent making
	// the same loadImage fetch requests multiple times (inefficient)
	this.p5play.images = {
		onLoad: (img) => {} // called anytime an image is fully loaded
	};

	this.p5play.disableImages = false;

	const _loadImage = this.loadImage;

	/**
	 * Just like the p5.js loadImage function except it also caches images
	 * so that they are only loaded once. Multiple calls to loadImage with
	 * the same path will return the same image object. It also adds the
	 * image's url as a property of the image object.
	 *
	 * @param {string} url
	 * @param {number} [width]
	 * @param {number} [height]
	 * @param {function} [callback]
	 */
	this.loadImg = this.loadImage = function () {
		if (this.p5play.disableImages) return;
		let args = arguments;
		let url = args[0];
		let img = pInst.p5play.images[url];
		let cb;
		if (typeof args[args.length - 1] == 'function') {
			cb = args[args.length - 1];
		}
		if (img) {
			// if not finished loading, add callback to the list
			if ((img.width == 1 && img.height == 1) || !img.pixels.length) {
				if (cb) {
					img.cbs.push(cb);
					img.calls++;
				} else pInst._decrementPreload();
			} else {
				if (cb) cb(); // if already loaded, run the callback immediately
				pInst._decrementPreload();
			}
			return img;
		}
		const _cb = (_img) => {
			// if (!_img.pixels.length) {
			// 	log('hi');
			// 	_loadImage.call(pInst, url, _cb);
			// 	return;
			// }

			_img.w = _img.width;
			_img.h = _img.height;
			for (let cb of _img.cbs) {
				cb(_img);
			}
			for (let i = 1; i < _img.calls; i++) {
				pInst._decrementPreload();
			}
			// delete _img.calls;
			// delete _img.cbs;
			_img.cbs = [];
			pInst.p5play.images.onLoad(img);
		};
		img = _loadImage.call(pInst, url, _cb);
		img.cbs = [];
		img.calls = 1;
		if (cb) img.cbs.push(cb);
		img.url = url;
		pInst.p5play.images[url] = img;
		// setTimeout(() => {
		// 	if (!img.width && !img.height) {
		// 		console.warn('Image may have failed to load: ' + url);
		// 	}
		// }, 3000);
		return img;
	};

	let errMsgs = {
		generic: [
			'Ah! I found an error',
			'Oh no! Something went wrong',
			'Oof! Something went wrong',
			'Houston, we have a problem',
			'Whoops, having trouble here'
		],
		Sprite: {
			constructor: {
				base: "Sorry I'm unable to make a new Sprite",
				0: "What is $0 for? If you're trying to specify the x position of the sprite, please specify the y position as well.",
				1: "If you're trying to specify points for a chain Sprite, please use an array of position arrays.\n$0"
			},
			hw: {
				0: "I can't change the halfWidth of a Sprite directly, change the sprite's width instead."
			},
			hh: {
				1: "I can't change the halfHeight of a Sprite directly, change the sprite's height instead."
			},
			rotate: {
				0: "Can't use this function on a sprite with a static collider, try changing the sprite's collider type to kinematic.",
				1: 'Can\'t use "$0" for the angle of rotation, it must be a number.'
			},
			rotateTo: {},
			rotateTowards: {},
			changeAnimation: `I can't find any animation named "$0".`,
			collide: {
				0: "I can't make that sprite collide with $0. Sprites can only collide with another sprite or a group.",
				1: 'The collision callback has to be a function.',
				2: "You're trying to check for an collision with a sprite or group that doesn't exist!"
			},
			overlap: {
				0: "I can't make that sprite overlap with $0. Sprites can only overlap with another sprite or a group.",
				1: 'The overlap callback has to be a function.',
				2: "You're trying to check for an overlap with a sprite or group that doesn't exist!"
			}
		},
		SpriteAnimation: {
			constructor: {
				base: "Hey so, I tried to make a new SpriteAnimation but couldn't",
				0: `I don't know how to display this type of image: "$0". I can only use ".png" image files.`,
				1: 'The name of the animation must be the first input parameter.'
			}
		},
		Group: {
			constructor: {
				base: "Hmm awkward! Well it seems I can't make that new Group you wanted"
			}
		}
	};
	errMsgs.Group.collide = errMsgs.Sprite.collide;
	errMsgs.Group.overlap = errMsgs.Sprite.overlap;
	errMsgs.Sprite.rotateTo[0] = errMsgs.Sprite.rotateTowards[0] = errMsgs.Sprite.rotate[0];

	/**
	 * A FriendlyError is a custom error class that extends the native JS Error class.
	 *
	 * @private
	 * @param {String} func is the name of the function the error was thrown in
	 * @param {Number} errorNum is the error's code number
	 * @param {Array} e is an array with references to the cause of the error
	 */
	class FriendlyError extends Error {
		constructor(func, errorNum, e) {
			super();

			if (typeof func != 'string') {
				e = errorNum;
				errorNum = func;
				func = this.stack.match(/\n\s*at ([^\(]*)/)[1];
				func = func.slice(0, -1);
			}
			if (typeof errorNum != 'number') {
				e = errorNum;
				errorNum = undefined;
			}
			if (func.slice(0, 3) == 'new') func = func.slice(4);
			func = func.split('.');
			let className = func[0];
			func = func[1] || 'constructor';

			let ln = this.stack.match(/\/([^p\/][^5][^\/:]*:[^\/:]+):/);
			if (ln) {
				ln = ln[1].split(':');
				ln = ' in ' + ln[0] + ' at line ' + ln[1];
			}
			ln = ' using ' + className + '.' + func + '. ';

			e = e || [];

			let m = errMsgs[className][func];
			let msg;
			if (m.base) msg = m.base + ln;
			else msg = errMsgs.generic[Math.floor(Math.random() * errMsgs.generic.length)] + ln;
			if (errorNum !== undefined) m = m[errorNum];
			m = m.replace(/\$([0-9]+)/g, (m, n) => {
				return e[n];
			});
			msg += m;

			p5._friendlyError(msg, func);
		}
	}

	/**
	 * A group of all the sprites.
	 *
	 * @type {Group}
	 */
	this.allSprites = new this.Group();

	/**
	 * The planck physics world. Use this to change gravity and offset the
	 * sprite's coordinate system.
	 *
	 * @type {World}
	 */
	this.world = new this.World();

	/**
	 * The default camera. Use this to pan and zoom the camera.
	 *
	 * @type {Camera}
	 */
	this.camera = new this.Camera();

	this.InputDevice = class {
		/**
		 * <a href="https://p5play.org/learn/input_devices.html">
		 * Look at the Input reference pages before reading these docs.
		 * </a>
		 *
		 * Root class for storing the state of inputs (mouse, keyboard,
		 * gamepads).
		 *
		 * -3 means input was released after being held, pressed for 12 frames
		 * -2 means input was pressed and released on the same frame
		 * -1 means input was released
		 * 0 means input is not pressed
		 * 1 means input was pressed
		 * >1 means input is still being pressed
		 * 12 means input was held
		 * >12 means input is being held
		 */
		constructor() {
			/**
			 * The amount of frames an input must be pressed to be considered held.
			 * Default is 12.
			 *
			 * @type {number}
			 */
			this.holdThreshold = 12;
		}

		/**
		 * Initializes the input's values to zero.
		 *
		 * @private
		 */
		init(inputs) {
			for (let inp of inputs) {
				this[inp] = 0;
			}
		}

		/**
		 * Attempt to auto-correct the user's input. Inheriting classes
		 * override this method.
		 *
		 * @private
		 */
		ac(inp) {
			return inp;
		}

		/**
		 * @param {string} inp
		 * @returns {boolean} true on the first frame that the user presses the input
		 */
		presses(inp) {
			inp ??= this.default;
			if (this[inp] === undefined) inp = this.ac(inp);
			return this[inp] == 1 || this[inp] == -2;
		}

		/**
		 * @param {string} inp
		 * @returns {number} the amount of frames the user has been pressing the input
		 */
		pressing(inp) {
			inp ??= this.default;
			if (this[inp] === undefined) inp = this.ac(inp);
			if (this[inp] == -2) return 1;
			return this[inp] > 0 ? this[inp] : 0;
		}

		/**
		 * @param {string} inp
		 * @returns {boolean} true on the first frame that the user released the input
		 */
		pressed(inp) {
			return this.released(inp);
		}

		/**
		 * @param {string} inp
		 * @returns {boolean} true on the first frame that the user holds the input
		 */
		holds(inp) {
			inp ??= this.default;
			if (this[inp] === undefined) inp = this.ac(inp);
			return this[inp] == this.holdThreshold;
		}

		/**
		 * @param {string} inp
		 * @returns {number} the amount of frames the user has been holding the input
		 */
		holding(inp) {
			inp ??= this.default;
			if (this[inp] === undefined) inp = this.ac(inp);
			return this[inp] >= this.holdThreshold ? this[inp] : 0;
		}

		/**
		 * @param {string} inp
		 * @returns {boolean} true on the first frame that the user released a held input
		 */
		held(inp) {
			inp ??= this.default;
			if (this[inp] === undefined) inp = this.ac(inp);
			return this[inp] == -3;
		}

		/**
		 * @param {string} inp
		 * @returns {boolean} true on the first frame that the user released the input
		 */
		released(inp) {
			inp ??= this.default;
			if (this[inp] === undefined) inp = this.ac(inp);
			return this[inp] <= -1;
		}

		releases(inp) {
			return this.released(inp);
		}
	};

	this._Mouse = class extends this.InputDevice {
		/**
		 * <a href="https://p5play.org/learn/input_devices.html">
		 * Look at the Input reference pages before reading these docs.
		 * </a>
		 */
		constructor() {
			super();
			let _this = this;

			// this.x and this.y store the actual position values of the mouse
			this._position = {
				get x() {
					return _this.x;
				},
				set x(val) {
					_this.x = val;
				},
				get y() {
					return _this.y;
				},
				set y(val) {
					_this.y = val;
				}
			};

			let inputs = ['x', 'y', 'left', 'center', 'right'];
			this.init(inputs);
			this.default = 'left';
			this.draggable = false;
			this.isOnCanvas = false;
			this.active = false;

			/**
			 * The mouse's x position.
			 * @type {number}
			 */
			this.x;

			/**
			 * The mouse's y position.
			 * @type {number}
			 */
			this.y;
		}

		/**
		 * The mouse's position.
		 * @type {object}
		 */
		get pos() {
			return this._position;
		}
		/**
		 * The mouse's position. Alias for pos.
		 * @type {object}
		 */
		get position() {
			return this._position;
		}

		ac(inp) {
			if (inp.slice(0, 4)) inp = 'left';
			else if (inp.slice(0, 5) == 'right') inp = 'right';
			else if (inp.slice(0, 6) == 'middle') inp = 'center';
			else inp = inp.toLowerCase();
			return inp;
		}

		/**
		 * @param {string} inp
		 * @returns {number} the amount of frames the user has been dragging the input
		 */
		dragging(inp) {
			inp ??= this.default;
			this.draggable = true;
			return this[inp] >= this.holdThreshold ? this[inp] : 0;
		}
	};

	/**
	 * Get user input from the mouse.
	 * Stores the state of the left, center, or right mouse buttons.
	 *
	 * @type {Mouse}
	 */
	this.mouse = new this._Mouse();

	this._SpriteMouse = class extends this._Mouse {
		constructor() {
			super();
			this.hover = 0;
		}

		/**
		 * @returns {boolean} true on the first frame that the mouse is over the sprite
		 */
		hovers() {
			return this.hover == 1;
		}

		/**
		 * @returns {number} the amount of frames the mouse has been over the sprite
		 */
		hovering() {
			return this.hover > 0 ? this.hover : 0;
		}

		/**
		 * @returns {boolean} true on the first frame that the mouse is no longer over the sprite
		 */
		hovered() {
			return this.hover == -1;
		}
	};

	const _onmousedown = this._onmousedown;

	const __onmousedown = function (btn) {
		this.mouse[btn]++;
		this.mouse.active = true;

		let ms;
		if (this.world.mouseSprites.length) {
			ms = this.world.mouseSprites[0];
			ms.mouse[btn] = 1;
			// old mouse sprite didn't have the mouse released on it
			// so it just gets set to 0 (not pressed)
			if (this.world.mouseSprite) {
				this.world.mouseSprite.mouse[btn] = 0;
				if (btn == 'left') {
					this.world.mouseSprite.mouse.draggable = false;
				}
			}
			this.world.mouseSprite = ms;
		}
	};

	this._onmousedown = function (e) {
		let btn = 'left';
		if (e.button === 1) btn = 'center';
		else if (e.button === 2) btn = 'right';

		__onmousedown.call(this, btn);

		_onmousedown.call(this, e);
	};

	const _ontouchstart = this._ontouchstart;

	this._ontouchstart = function (e) {
		__onmousedown.call(this, 'left');
		_ontouchstart.call(this, e);
	};

	const _onmouseup = this._onmouseup;

	const __onmouseup = function (btn) {
		if (this.mouse[btn] >= this.mouse.holdThreshold) {
			this.mouse[btn] = -3;
		} else if (this.mouse[btn] > 1) this.mouse[btn] = -1;
		else this.mouse[btn] = -2;

		if (this.world.mouseSprite) {
			if (this.world.mouseSprite.mouse.hover > 1) {
				if (this.world.mouseSprite.mouse[btn] >= this.mouse.holdThreshold) {
					this.world.mouseSprite.mouse[btn] = -3;
				} else if (this.world.mouseSprite.mouse[btn] > 1) {
					this.world.mouseSprite.mouse[btn] = -1;
				} else {
					this.world.mouseSprite.mouse[btn] = -2;
				}
			} else {
				this.world.mouseSprite.mouse[btn] = 0;
				this.world.mouseSprite.mouse.draggable = false;
			}
		}
	};

	this._onmouseup = function (e) {
		let btn = 'left';
		if (e.button === 1) btn = 'center';
		else if (e.button === 2) btn = 'right';

		__onmouseup.call(this, btn);
		_onmouseup.call(this, e);
	};

	const _ontouchend = this._ontouchend;

	this._ontouchend = function (e) {
		__onmouseup.call(this, 'left');
		_ontouchend.call(this, e);
	};

	this._KeyBoard = class extends this.InputDevice {
		constructor() {
			super();
			this.default = ' ';
		}

		ac(inp) {
			if (inp.length == 1) return inp.toLowerCase();
			if (!isNaN(inp)) {
				if (inp == 38) return 'ArrowUp';
				if (inp == 40) return 'ArrowDown';
				if (inp == 37) return 'ArrowLeft';
				if (inp == 39) return 'ArrowRight';
				if (inp < 10) return inp + '';
				throw new Error(
					'Use key names with the keyboard input functions, not key codes! If you are trying to detect if the user pressed a number key make it a string. For example: "5"'
				);
			}
			if (inp == 'space' || inp == 'spacebar') return ' ';
			return inp[0].toUpperCase() + inp.slice(1).toLowerCase();
		}

		get space() {
			return this[' '];
		}
		get spacebar() {
			return this[' '];
		}
	};

	/**
	 * Get user input from the keyboard.
	 *
	 * @type {KeyBoard}
	 */
	this.kb = new this._KeyBoard();
	delete this._KeyBoard;

	/**
	 * Alias for kb.
	 *
	 * @type {KeyBoard}
	 */
	this.keyboard = this.kb;

	if (navigator.keyboard) {
		const keyboard = navigator.keyboard;
		if (window == window.top) {
			keyboard.getLayoutMap().then((keyboardLayoutMap) => {
				const key = keyboardLayoutMap.get('KeyW');
				if (key != 'w') this.p5play.standardizeKeyboard = true;
			});
		} else {
			this.p5play.standardizeKeyboard = true;
		}
	} else {
		// Firefox doesn't have navigator.keyboard
		// so just make it use key codes
		this.p5play.standardizeKeyboard = true;
	}

	/**
	 * Obsolete: Use kb.pressing(key) instead.
	 *
	 * @deprecated
	 * @obsolete
	 * @param {String} key
	 */
	this.keyIsDown = function (keyCode) {
		throw new Error(
			`The p5.js keyIsDown function is outdated and can't be used in p5play. Trust me, you'll see that the p5play kb.pressing function is much better. It uses key name strings that are easier to write and easier to read! https://p5play.org/learn/input_devices.html The p5.js keyIsDown function relies on key codes and custom constants for key codes, which are not only hard to remember but were also deprecated in the JavaScript language standards over six years ago and shouldn't be used in new projects. More info: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode`
		);
	};

	/**
	 * @private
	 * @param {*} e keyboard event
	 * @returns key name
	 */
	function _getKeyFromCode(e) {
		let code = e.code;
		if (code.length == 4 && code.slice(0, 3) == 'Key') {
			return code[3].toLowerCase();
		}
		return e.key;
	}

	let simpleKeyControls = {
		w: 'up',
		s: 'down',
		a: 'left',
		d: 'right',
		ArrowUp: 'up',
		ArrowDown: 'down',
		ArrowLeft: 'left',
		ArrowRight: 'right',
		i: 'up2',
		k: 'down2',
		j: 'left2',
		l: 'right2'
	};

	const _onkeydown = this._onkeydown;

	this._onkeydown = function (e) {
		let key = e.key;
		if (this.p5play.standardizeKeyboard) {
			key = _getKeyFromCode(e);
		}
		let keys = [key];
		let k = simpleKeyControls[key];
		if (k) keys.push(k);
		for (let k of keys) {
			if (!this.kb[k] || this.kb[k] < 0) {
				this.kb[k] = 1;
			}
		}
		_onkeydown.call(this, e);
	};

	const _onkeyup = this._onkeyup;

	this._onkeyup = function (e) {
		let key = e.key;
		if (this.p5play.standardizeKeyboard) {
			key = _getKeyFromCode(e);
		}
		let keys = [key];
		let k = simpleKeyControls[key];
		if (k) keys.push(k);
		for (let k of keys) {
			if (this.kb[k] >= this.kb.holdThreshold) {
				this.kb[k] = -3;
			} else if (this.kb[k] > 1) this.kb[k] = -1;
			else this.kb[k] = -2;
		}

		_onkeyup.call(this, e);
	};

	this._Contro = class extends this.InputDevice {
		constructor(gp) {
			super();
			let inputs = [
				'a',
				'b',
				'x',
				'y',
				'l',
				'r',
				'lt',
				'rt',
				'select',
				'start',
				'up',
				'down',
				'left',
				'right',
				'leftTrigger',
				'rightTrigger'
			];
			this.init(inputs);

			this.leftStick = {
				x: 0,
				y: 0,
				btn: 0
			};

			this.rightStick = {
				x: 0,
				y: 0,
				btn: 0
			};

			this._btns = {
				a: 0,
				b: 1,
				x: 2,
				y: 3,
				l: 4,
				r: 5,
				lt: 6,
				rt: 7,
				select: 8,
				start: 9,
				leftStickButton: 10,
				rightStickButton: 11,
				up: 12,
				down: 13,
				left: 14,
				right: 15
			};
			this._axes = {
				leftStick: {
					x: 0,
					y: 1
				},
				rightStick: {
					x: 2,
					y: 3
				},
				leftTrigger: 4,
				rightTrigger: 5
			};

			// corrects button mapping for GuliKit gamepads
			// which have a Nintendo Switch style button layout
			// https://www.aliexpress.com/item/1005003624801819.html
			if (gp.id.includes('GuliKit')) {
				this._btns.a = 1;
				this._btns.b = 0;
				this._btns.x = 3;
				this._btns.y = 2;
			}

			log(gp);

			this.gamepad = gp;
			this.id = gp.id;
		}

		ac(inp) {
			return inp.toLowerCase();
		}

		_update() {
			this.gamepad = navigator.getGamepads()[this.gamepad.index];
			if (!this.gamepad) return;

			let pad = this.gamepad;

			// buttons
			for (let name in this._btns) {
				let idx = this._btns[name];
				if (pad.buttons[idx].pressed) this[name]++;
				else this[name] = 0;
			}

			// sticks
			this.leftStick.x = pad.axes[this._axes.leftStick.x];
			this.leftStick.y = pad.axes[this._axes.leftStick.y];

			this.rightStick.x = pad.axes[this._axes.rightStick.x];
			this.rightStick.y = pad.axes[this._axes.rightStick.y];

			// triggers
			if (pad.axes[this._axes.leftTrigger] !== undefined) {
				this.leftTrigger = pad.axes[this._axes.leftTrigger];
				this.rightTrigger = pad.axes[this._axes.rightTrigger];
			} else {
				this.leftTrigger = pad.buttons[this._btns.lt].value;
				this.rightTrigger = pad.buttons[this._btns.rt].value;
			}

			return true; // update completed
		}
	};

	this._Contros = class extends Array {
		constructor() {
			super();
			let _this = this;
			window.addEventListener('gamepadconnected', (e) => {
				_this._addContro(e.gamepad);
			});
			// TODO
			// window.addEventListener('gamepaddisconnected', (e) => {
			// 	_this._removeContro(e.gamepad);
			// });

			this.default = 'a';

			let methods = ['presses', 'pressing', 'pressed', 'holds', 'holding', 'held', 'released'];
			for (let m of methods) {
				this[m] = (inp) => {
					if (this[0]) return this[0][m](inp);
				};
			}

			let inputs = [
				'a',
				'b',
				'x',
				'y',
				'l',
				'r',
				'lt',
				'rt',
				'select',
				'start',
				'leftStickButton',
				'rightStickButton',
				'up',
				'down',
				'left',
				'right'
			];
			for (let inp of inputs) {
				Object.defineProperty(this, inp, {
					get() {
						if (_this[0]) return _this[0][inp];
						return 0;
					}
				});
			}

			let props = ['leftStick', 'rightStick'];
			for (let prop of props) {
				this[prop] = {};
				for (let axis of ['x', 'y']) {
					Object.defineProperty(this[prop], axis, {
						get() {
							if (_this[0]) return _this[0][prop][axis];
							return 0;
						}
					});
				}
			}

			// test if the broswer supports the HTML5 Gamepad API
			// all modern browsers do, this is really just to prevent
			// p5play's Jest tests from failing
			if (!navigator?.getGamepads) return;

			// if the page was not reloaded, but p5play sketch was,
			// then gamepads could be already connected
			// so they need to be added as Contro objects
			let gps = navigator.getGamepads();
			for (let gp of gps) {
				if (gp) this._addContro(gp);
			}
		}

		_addContro(gp) {
			if (!gp) return;
			log('controller ' + this.length + ' connected: ' + gp.id);
			this.push(new pInst._Contro(gp));
		}

		/**
		 * Updates the state of all controllers.
		 *
		 * @private
		 */
		_update() {
			for (let c of this) {
				c._update();
			}
		}
	};

	/**
	 * Get user input from game controllers.
	 *
	 * @type {Contros}
	 */
	this.contro = new this._Contros();
	delete this._Contros;

	/**
	 * Alias for contro
	 *
	 * @type {Contros}
	 */
	this.controllers = this.contro;

	if (!this.getFPS) this.p5play._fps = 60;

	/**
	 * Use this function to performance test your game code. FPS, amongst
	 * the gaming community, refers to how many frames a game could render
	 * per second, not including the delay between when frames are shown
	 * on the screen. The higher the FPS, the better the game is
	 * performing.
	 *
	 * @returns {Number} The current FPS
	 */
	this.getFPS ??= () => this.p5play._fps;

	this.loadAds = (provider, opt) => {
		opt ??= {};
		if (window.webkit !== undefined) {
			// iOS
			window.webkit.messageHandlers.p5play.postMessage(JSON.stringify(opt));
		}
	};

	this.showAd = (type) => {
		if (type) type = type.toLowerCase();
		type ??= 'interstitial';
		if (window.webkit !== undefined) {
			confirm('p5play:' + type);
		}
	};
});

// called before each p5.js draw function call
p5.prototype.registerMethod('pre', function p5playPreDraw() {
	if (this.p5play._fps) {
		this.p5play._preDrawFrameTime = performance.now();
	}

	if (this.frameCount == 1) {
		if (!this.camera.x) this.camera.x = this.world.hw;
		if (!this.camera.y) this.camera.y = this.world.hh;
		this.camera.init = true;

		// this stops the right click menu from appearing
		this.canvas.addEventListener('contextmenu', (event) => event.preventDefault());
	}

	this.mouse.x = (this.mouseX - this.world.hw) / this.camera.zoom + this.camera.x;
	this.mouse.y = (this.mouseY - this.world.hh) / this.camera.zoom + this.camera.y;

	this.camera.mouse.x = this.mouseX;
	this.camera.mouse.y = this.mouseY;

	this.contro._update();
});

// called after each p5.js draw function call
p5.prototype.registerMethod('post', function p5playPostDraw() {
	this.p5play._inPostDraw = true;

	if (this.allSprites.autoCull) {
		this.allSprites.cull(10000);
	}

	if (this.allSprites._autoDraw) {
		this.camera.on();
		this.allSprites.draw();
		this.camera.off();
	}
	if (this.allSprites._autoDraw === null) {
		this.allSprites._autoDraw = true;
	}

	if (this.world.autoStep) {
		this.world.step();
	}
	if (this.world.autoStep === null) {
		this.world.autoStep = true;
	}

	if (this.allSprites._autoUpdate) {
		this.allSprites.update();
	}
	if (this.allSprites._autoUpdate === null) {
		this.allSprites._autoUpdate = true;
	}

	for (let s of this.allSprites) {
		s.autoDraw ??= true;
		s.autoUpdate ??= true;
	}

	for (let btn of ['left', 'center', 'right']) {
		if (this.mouse[btn] < 0) this.mouse[btn] = 0;
		else if (this.mouse[btn] > 0) this.mouse[btn]++;

		if (this.world.mouseSprite) {
			if (this.world.mouseSprite.mouse[btn] < 0) {
				this.world.mouseSprite.mouse[btn] = 0;
			}
		}
	}

	for (let k in this.kb) {
		if (k == 'holdThreshold') continue;
		if (this.kb[k] < 0) this.kb[k] = 0;
		else if (this.kb[k] > 0) this.kb[k]++;
	}

	if (this.world.mouseTracking) {
		if (this.world.mouseSprite) {
			let val = 0;
			for (let btn of ['left', 'center', 'right']) {
				val += this.world.mouseSprite.mouse[btn];
			}
			if (val == 0) this.world.mouseSprite = null;
		}

		let sprites = this.world.getSpritesAt(this.mouse.x, this.mouse.y);
		sprites.sort((a, b) => (a.layer - b.layer) * -1);

		let uiSprites = this.world.getSpritesAt(this.camera.mouse.x, this.camera.mouse.y, this.allSprites, false);
		uiSprites.sort((a, b) => (a.layer - b.layer) * -1);

		sprites = sprites.concat(uiSprites);

		let ms;
		if (this.mouse.pressing('left') || this.mouse.pressing('center') || this.mouse.pressing('right')) {
			// mouse sprite is not draggable
			if (!this.world.mouseSprite?.mouse.draggable) {
				// if sprite is being dragged,
				// it should be dragged behind sprites on higher layers
				for (let s of sprites) {
					if (s == this.world.mouseSprite) {
						ms = s;
						break;
					}
				}
			} else {
				ms = this.world.mouseSprite;
			}
			// if mouse is pressing the sprite
			if (ms) {
				ms.mouse.left = this.mouse.left;
				ms.mouse.center = this.mouse.center;
				ms.mouse.right = this.mouse.right;
				ms.mouse.x = ms.x - this.mouse.x;
				ms.mouse.y = ms.y - this.mouse.y;
			} else if (this.world.mouseSprite) {
				this.world.mouseSprite.mouse.left = 0;
				this.world.mouseSprite.mouse.center = 0;
				this.world.mouseSprite.mouse.right = 0;
				this.world.mouseSprite.mouse.draggable = false;
			}
		}

		for (let s of sprites) {
			s.mouse.hover++;
		}

		for (let s of this.world.mouseSprites) {
			if ((!this.world.mouseSprite?.mouse.draggable || s != ms) && !sprites.includes(s)) {
				s.mouse.hover = -1;
				s.mouse.left = 0;
				s.mouse.center = 0;
				s.mouse.right = 0;
				s.mouse.draggable = false;
			}
		}
		this.world.mouseSprites = sprites;
	}

	this.camera.off();

	if (this.p5play._fps) {
		this.p5play._postDrawFrameTime = performance.now();
		this.p5play._fps = Math.round(1000 / (this.p5play._postDrawFrameTime - this.p5play._preDrawFrameTime)) || 1;
	}
	this.p5play._inPostDraw = false;
});
