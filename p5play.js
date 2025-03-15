/**
 * p5play
 * @version 3.26
 * @author quinton-ashley
 */

if (typeof planck != 'object') {
	if (typeof process == 'object') {
		global.planck = require('./planck.min.js');
	} else throw 'planck.js must be loaded before p5play';
}

p5.prototype.registerMethod('init', function p5playInit() {
	const $ = this; // the p5 or q5 instance that called p5playInit
	const pl = planck;

	// Google Analytics collects anonymous usage data to help make p5play better.
	// To opt out, set window._p5play_gtagged to false before loading p5play.
	if (
		typeof process != 'object' && // don't track in node.js
		window._p5play_gtagged != false
	) {
		let script = document.createElement('script');
		script.src = 'https://www.googletagmanager.com/gtag/js?id=G-EHXNCTSYLK';
		script.async = true;
		document.head.append(script);
		window._p5play_gtagged = true;

		script.onload = () => {
			window.dataLayer ??= [];
			window.gtag = function () {
				dataLayer.push(arguments);
			};
			gtag('js', new Date());
			gtag('config', 'G-EHXNCTSYLK');
			gtag('event', 'p5play_v3_26');
		};
	}

	// in p5play the default angle mode is degrees
	const DEGREES = $.DEGREES;
	$.angleMode(DEGREES);

	// scale to planck coordinates from p5 coordinates
	const scaleTo = (x, y, tileSize) =>
		new pl.Vec2((x * tileSize) / $.world.meterSize, (y * tileSize) / $.world.meterSize);
	const scaleXTo = (x, tileSize) => (x * tileSize) / $.world.meterSize;

	// scale from planck coordinates to p5 coordinates
	const scaleFrom = (x, y, tileSize) =>
		new pl.Vec2((x / tileSize) * $.world.meterSize, (y / tileSize) * $.world.meterSize);
	const scaleXFrom = (x, tileSize) => (x / tileSize) * $.world.meterSize;

	const linearSlop = pl.Settings.linearSlop;
	const angularSlop = pl.Settings.angularSlop / 60;
	const isSlop = (val) => Math.abs(val) <= linearSlop;
	const fixRound = (val, slop) => (Math.abs(val - Math.round(val)) <= (slop || linearSlop) ? Math.round(val) : val);

	const minAngleDist = (ang, rot) => {
		let full = $._angleMode == DEGREES ? 360 : $.TWO_PI;
		let dist1 = (ang - rot) % full;
		let dist2 = (full - Math.abs(dist1)) * -Math.sign(dist1);
		return (Math.abs(dist1) < Math.abs(dist2) ? dist1 : dist2) || 0;
	};

	const eventTypes = {
		_collisions: ['_collides', '_colliding', '_collided'],
		_overlappers: ['_overlaps', '_overlapping', '_overlapped']
	};

	/**
	 * @class
	 */
	this.P5Play = class {
		/**
		 * This class is deleted after it's used
		 * to create the `p5play` object
		 * which contains information about the sketch.
		 */
		constructor() {
			/**
			 * Contains all the sprites in the sketch,
			 * but users should use the `allSprites` group.
			 *
			 * The keys are the sprite's unique ids.
			 * @type {Object.<number, Sprite>}
			 */
			this.sprites = {};
			/**
			 * Contains all the groups in the sketch,
			 *
			 * The keys are the group's unique ids.
			 * @type {Object.<number, Group>}
			 */
			this.groups = {};
			this.groupsCreated = 0;
			this.spritesCreated = 0;
			this.spritesDrawn = 0;

			/**
			 * Cache for loaded images.
			 */
			this.images = {};

			/**
			 * Used for debugging, set to true to make p5play
			 * not load any images.
			 * @type {Boolean}
			 * @default false
			 */
			this.disableImages = false;

			/**
			 * The default color palette, at index 0 of this array,
			 * has all the letters of the English alphabet mapped to colors.
			 * @type {Array}
			 */
			this.palettes = [];

			/**
			 * Emoji scale factor, used when making emoji images.
			 * @type {Number}
			 * @default 1
			 */
			this.emojiScale = 1;

			/**
			 * Friendly rounding eliminates some floating point errors.
			 * @type {Boolean}
			 * @default true
			 */
			this.friendlyRounding = true;

			/**
			 * Groups that are removed using `group.remove()` are not
			 * fully deleted from `p5play.groups` by default, so their data
			 * is still accessible. Set to false to permanently delete
			 * removed groups, which reduces memory usage.
			 * @type {Boolean}
			 * @default true
			 */
			this.storeRemovedGroupRefs = true;

			/**
			 * Snaps sprites to the nearest `p5play.gridSize`
			 * increment when they are moved.
			 * @type {Boolean}
			 * @default false
			 */
			this.snapToGrid = false;

			/**
			 * The size of the grid cells that sprites are snapped to.
			 * @type {Number}
			 * @default 0.5
			 */
			this.gridSize = 0.5;

			/**
			 * Information about the operating system being used to run
			 * p5play, retrieved from the `navigator` object.
			 */
			this.os = {};
			this.context = 'web';

			if (window.matchMedia) this.hasMouse = window.matchMedia('(any-hover: none)').matches ? false : true;
			else this.hasMouse = true;
			this.standardizeKeyboard = false;

			if (typeof navigator == 'object') {
				let idx = navigator.userAgent.indexOf('iPhone OS');
				if (idx > -1) {
					let version = navigator.userAgent.substring(idx + 10, idx + 12);

					this.os.platform = 'iOS';
					this.os.version = version;
				} else {
					let pl = navigator.userAgentData?.platform;
					if (!pl && navigator.platform) {
						pl = navigator.platform.slice(3);
						if (pl == 'Mac') pl = 'macOS';
						else if (pl == 'Win') pl = 'Windows';
						else if (pl == 'Lin') pl = 'Linux';
					}
					this.os.platform = pl;
				}
			}

			/**
			 * Displays the number of sprites drawn, the current FPS
			 * as well as the average, minimum, and maximum FPS achieved
			 * during the previous second.
			 *
			 * FPS in this context refers to how many frames per second your
			 * computer can generate, based on the physics calculations and any
			 * other processes necessary to generate a frame, but not
			 * including the delay between when frames are actually shown on
			 * the screen. The higher the FPS, the better your game is
			 * performing.
			 *
			 * You can use this function for approximate performance testing.
			 * But for the most accurate results, use your web browser's
			 * performance testing tools.
			 *
			 * Generally having less sprites and using a smaller canvas will
			 * make your game perform better. Also drawing images is faster
			 * than drawing shapes.
			 * @type {Boolean}
			 * @default false
			 */
			this.renderStats = false;
			this._renderStats = {
				x: 10,
				y: 20,
				font: 'monospace'
			};
			this._fps = 60;
			this._fpsArr = [60];

			/*
			 * Ledgers for collision callback functions.
			 *
			 * Doing this:
			 * group1.collides(group2, cb1);
			 * sprite0.collides(sprite1, cb0);
			 *
			 * Would result in this:
			 * p5play._collides = {
			 *   1: {
			 *     2: cb1
			 *   },
			 *   1000: {
			 *     2: cb1,
			 *     1001: cb0
			 *   }
			 * };
			 */
			this._collides = {};
			this._colliding = {};
			this._collided = {};
			/*
			 * Ledgers for overlap callback functions.
			 */
			this._overlaps = {};
			this._overlapping = {};
			this._overlapped = {};
		}

		/**
		 * This function is called when an image is loaded. By default it
		 * does nothing, but it can be overridden.
		 */
		onImageLoad() {}
	};

	/**
	 * Contains information about the sketch.
	 * @type {P5Play}
	 */
	this.p5play = new $.P5Play();
	delete $.P5Play;

	let usePhysics = true;
	let timeScale = 1;

	let log = ($.log = console.log);

	$.DYN = $.DYNAMIC = 'dynamic';
	$.STA = $.STATIC = 'static';
	$.KIN = $.KINEMATIC = 'kinematic';

	/**
	 * @class
	 */
	this.Sprite = class {
		/**
		 * <a href="https://p5play.org/learn/sprite.html">
		 * Look at the Sprite reference pages before reading these docs.
		 * </a>
		 *
		 * The Sprite constructor can be used in many different ways.
		 *
		 * In fact it's so flexible that I've only listed out some of the
		 * most common ways it can be used in the examples section below.
		 * Try experimenting with it! It's likely to work the way you
		 * expect it to, if not you'll just get an error.
		 *
		 * Special feature! If the first parameter to this constructor is a
		 * loaded Image, Ani, or name of a animation,
		 * then the Sprite will be created with that animation. If the
		 * dimensions of the sprite are not given, then the Sprite will be
		 * created using the dimensions of the animation.
		 *
		 * Every sprite you create is added to the `allSprites`
		 * group and put on the top draw order layer, in front of all
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
		 * let spr = new Sprite();
		 *
		 * let rectangle = new Sprite(x, y, width, height);
		 *
		 * let circle = new Sprite(x, y, diameter);
		 *
		 * let spr = new Sprite(aniName, x, y);
		 *
		 * let line = new Sprite(x, y, [length, angle]);
		 */
		constructor(x, y, w, h, collider) {
			// using boolean flags is faster than instanceof checks
			this._isSprite = true;

			/**
			 * Each sprite has a unique id number. Don't change it!
			 * They are useful for debugging.
			 * @type {Number}
			 */
			this.idNum;

			// id num is not set until the input params are validated

			let args = [...arguments];

			let group, ani;

			// first arg was a group to add the sprite to
			// used internally by the GroupSprite class
			if (args[0] !== undefined && args[0]._isGroup) {
				group = args[0];
				args = args.slice(1);
			}

			// first arg is a Ani, animation name, or Image
			if (
				args[0] !== undefined &&
				(typeof args[0] == 'string' || args[0] instanceof $.Ani || args[0] instanceof p5.Image)
			) {
				// shift
				ani = args[0];
				args = args.slice(1);
			}

			// invalid
			if (args.length == 1 && typeof args[0] == 'number') {
				throw new FriendlyError('Sprite', 0, [args[0]]);
			}

			if (!Array.isArray(args[0])) {
				// valid use for creating a box collider:
				// new Sprite(x, y, w, h, colliderType)
				x = args[0];
				y = args[1];
				w = args[2];
				h = args[3];
				collider = args[4];
			} else {
				// valid use for creating chain/polygon using vertex mode:
				// new Sprite([[x1, y1], [x2, y2], ...], colliderType)
				x = undefined;
				y = undefined;
				w = args[0];
				h = undefined;
				collider = args[1];
				if (Array.isArray(collider)) {
					throw new FriendlyError('Sprite', 1, [`[[${w}], [${h}]]`]);
				}
			}

			// valid use without setting size:
			// new Sprite(x, y, colliderType)
			if (typeof w == 'string') {
				collider = w;
				w = undefined;
			}

			if (typeof h == 'string') {
				if (isColliderType(h)) {
					// valid use to create a circle:
					// new Sprite(x, y, d, colliderType)
					collider = h;
				} else {
					// valid use to create a regular polygon:
					// new Sprite(x, y, sideLength, polygonName)
					w = getRegularPolygon(w, h);
				}
				h = undefined;
			}

			this.idNum = $.p5play.spritesCreated;
			this._uid = 1000 + this.idNum;
			$.p5play.sprites[this._uid] = this;
			$.p5play.spritesCreated++;

			/**
			 * Groups the sprite belongs to, including allSprites
			 * @type {Group[]}
			 * @default [allSprites]
			 */
			this.groups = [];

			/**
			 * Keys are the animation label, values are Ani objects.
			 * @type {Anis}
			 */
			this.animations = new $.Anis();

			/**
			 * Joints that the sprite is attached to
			 * @type {Joint[]}
			 * @default []
			 */
			this.joints = [];
			this.joints.removeAll = () => {
				while (this.joints.length) {
					this.joints.at(-1).remove();
				}
			};

			/**
			 * If set to true, p5play will record all changes to the sprite's
			 * properties in its `mod` array. Intended to be used to enable
			 * online multiplayer.
			 * @type {Boolean}
			 * @default undefined
			 */
			this.watch;

			/**
			 * An Object that has sprite property number codes as keys,
			 * these correspond to the index of the property in the
			 * Sprite.props array. The booleans values this object stores,
			 * indicate which properties were changed since the last frame.
			 * Useful for limiting the amount of sprite data sent in binary
			 * netcode to only the sprite properties that have been modified.
			 * @type {Object}
			 */
			this.mod = {};

			this._removed = false;
			this._life = 2147483647;
			this._visible = true;
			this._pixelPerfect = false;
			this._aniChangeCount = 0;
			this._draw = () => this.__draw();

			this._hasOverlap = {};
			this._collisions = {};
			this._overlappers = {};

			group ??= $.allSprites;

			this._tile = '';
			this.tileSize = group.tileSize || 1;

			let _this = this;

			// this.x and this.y are getters and setters that change this._pos internally
			// this.pos and this.position get this._position
			this._position = {
				x: 0,
				y: 0
			};

			this._pos = $.createVector.call($);

			Object.defineProperty(this._pos, 'x', {
				get() {
					if (!_this.body || !usePhysics) return _this._position.x;
					let x = (_this.body.getPosition().x / _this.tileSize) * $.world.meterSize;
					return $.p5play.friendlyRounding ? fixRound(x) : x;
				},
				set(val) {
					_this._position.x = val;

					if (_this.body) {
						let pos = new pl.Vec2((val * _this.tileSize) / $.world.meterSize, _this.body.getPosition().y);
						_this.body.setPosition(pos);
					}
				}
			});

			Object.defineProperty(this._pos, 'y', {
				get() {
					if (!_this.body || !usePhysics) return _this._position.y;
					let y = (_this.body.getPosition().y / _this.tileSize) * $.world.meterSize;
					return $.p5play.friendlyRounding ? fixRound(y) : y;
				},
				set(val) {
					_this._position.y = val;

					if (_this.body) {
						let pos = new pl.Vec2(_this.body.getPosition().x, (val * _this.tileSize) / $.world.meterSize);
						_this.body.setPosition(pos);
					}
				}
			});

			this._canvasPos = $.createVector.call($);

			Object.defineProperty(this._canvasPos, 'x', {
				get() {
					let x = _this._pos.x - $.camera.x;
					if ($.canvas.renderer == 'c2d') x += $.canvas.hw / $.camera._zoom;
					return x;
				}
			});

			Object.defineProperty(this._canvasPos, 'y', {
				get() {
					let y = _this._pos.y - $.camera.y;
					if ($.canvas.renderer == 'c2d') y += $.canvas.hh / $.camera._zoom;
					return y;
				}
			});

			// used by this._vel if the Sprite has no physics body
			this._velocity = {
				x: 0,
				y: 0
			};
			this._direction = 0;

			this._vel = $.createVector.call($);

			Object.defineProperties(this._vel, {
				x: {
					get() {
						let val;
						if (_this.body) val = _this.body.getLinearVelocity().x;
						else val = _this._velocity.x;
						val /= _this.tileSize;
						return $.p5play.friendlyRounding ? fixRound(val) : val;
					},
					set(val) {
						val *= _this.tileSize;
						if (_this.body) {
							_this.body.setLinearVelocity(new pl.Vec2(val, _this.body.getLinearVelocity().y));
						} else {
							_this._velocity.x = val;
						}
						if (val || this.y) _this._direction = this.heading();
					}
				},
				y: {
					get() {
						let val;
						if (_this.body) val = _this.body.getLinearVelocity().y;
						else val = _this._velocity.y;
						val /= _this.tileSize;
						return $.p5play.friendlyRounding ? fixRound(val) : val;
					},
					set(val) {
						val *= _this.tileSize;
						if (_this.body) {
							_this.body.setLinearVelocity(new pl.Vec2(_this.body.getLinearVelocity().x, val));
						} else {
							_this._velocity.y = val;
						}
						if (val || this.x) _this._direction = this.heading();
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
					if (_this.watch) _this.mod[20] = true;
					this._x = val ? -1 : 1;
				},
				get y() {
					return this._y < 0;
				},
				set y(val) {
					if (_this.watch) _this.mod[20] = true;
					this._y = val ? -1 : 1;
				}
			};

			this._heading = 'right';

			this._layer = group._layer;
			this._layer ??= $.allSprites._getTopLayer() + 1;

			if (group.dynamic) collider ??= 'dynamic';
			if (group.kinematic) collider ??= 'kinematic';
			if (group.static) collider ??= 'static';
			collider ??= group.collider;

			if (!collider || typeof collider != 'string') {
				collider = 'dynamic';
			}
			this.collider = collider;

			x ??= group.x;
			if (x === undefined) {
				if ($.canvas?.renderer == 'c2d' && !$._webgpuFallback) {
					x = $.canvas.hw / this.tileSize;
				} else x = 0;
				if (w) this._vertexMode = true;
			}
			y ??= group.y;
			if (y === undefined) {
				if ($.canvas?.renderer == 'c2d' && !$._webgpuFallback) {
					y = $.canvas.hh / this.tileSize;
				} else y = 0;
			}

			let forcedBoxShape = false;
			if (w === undefined) {
				w = group.w || group.width || group.d || group.diameter || group.v || group.vertices;
				if (!h && !group.d && !group.diameter) {
					h = group.h || group.height;
					forcedBoxShape = true;
				}
			}

			if (typeof x == 'function') x = x(group.length);
			if (typeof y == 'function') y = y(group.length);
			if (typeof w == 'function') w = w(group.length);
			if (typeof h == 'function') h = h(group.length);

			this.x = x;
			this.y = y;

			if (!group._isAllSpritesGroup) {
				if (!ani) {
					for (let _ani in group.animations) {
						ani = _ani;
						break;
					}
					if (!ani) {
						ani = group._img;
						if (typeof ani == 'function') {
							ani = ani(group.length);
						}
						if (ani) this._img = true;
					}
				}
			}

			// temporarily add all the groups the sprite belongs to,
			// since the next section of code could potentially load an
			// animation from one of the sprite's groups
			for (let g = group; g; g = $.p5play.groups[g.parent]) {
				this.groups.push(g);
			}
			this.groups.reverse();

			if (ani) {
				let ts = this.tileSize;

				if (this._img || ani instanceof p5.Image) {
					if (typeof ani != 'string') this.image = ani;
					else this.image = new $.EmojiImage(ani, w);

					if (!w && (this._img.w != 1 || this._img.h != 1)) {
						w = (this._img.defaultWidth || this._img.w) / ts;
						h ??= (this._img.defaultHeight || this._img.h) / ts;
					}
				} else {
					if (typeof ani == 'string') this._changeAni(ani);
					else this._ani = ani.clone();

					if (!w && (this._ani.w != 1 || this._ani.h != 1)) {
						w = (this._ani.defaultWidth || this._ani.w) / ts;
						h ??= (this._ani.defaultHeight || this._ani.h) / ts;
					}
				}
			}

			// make groups list empty, the sprite will be "officially" added
			// to its groups after its collider is potentially created
			this.groups = [];

			/**
			 * Used to detect mouse events with the sprite.
			 * @type {_SpriteMouse}
			 */
			this.mouse = new $._SpriteMouse();

			this._rotation = 0;
			this._rotationSpeed = 0;
			this._bearing = 0;

			this._scale = new Scale();

			Object.defineProperty(this._scale, 'x', {
				get() {
					return this._x;
				},
				set(val) {
					if (val == this._x) return;
					if (_this.watch) _this.mod[26] = true;
					let scalarX = Math.abs(val / this._x);
					_this._w *= scalarX;
					_this._hw *= scalarX;
					_this._resizeColliders({ x: scalarX, y: 1 });
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
					if (_this.watch) _this.mod[26] = true;
					let scalarY = Math.abs(val / this._y);
					if (_this._h) {
						this._h *= scalarY;
						this._hh *= scalarY;
					}
					_this._resizeColliders({ x: 1, y: scalarY });
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
					if (_this.watch) _this.mod[21] = true;
					_this._offsetCenterBy(val - this._x, 0);
				},
				get y() {
					return this._y;
				},
				set y(val) {
					if (val == this._y) return;
					if (_this.watch) _this.mod[21] = true;
					_this._offsetCenterBy(0, val - this._y);
				}
			};

			this._massUndef = true;
			if (w === undefined) {
				this._dimensionsUndef = true;
				this._widthUndef = true;
				w = this.tileSize > 1 ? 1 : 50;
				if (h === undefined) this._heightUndef = true;
			}

			if (forcedBoxShape) h ??= this.tileSize > 1 ? 1 : 50;

			this._shape = group.shape;

			// if collider is not "none"
			if (this.__collider != 3) {
				if (this._vertexMode) this.addCollider(w);
				else this.addCollider(0, 0, w, h);
				this.shape = this._shape;
			} else {
				this.w = w;
				if (Array.isArray(w)) {
					throw new Error(
						'Cannot set the collider type of a sprite with a polygon or chain shape to "none". To achieve the same effect, use .overlaps(allSprites) to have your sprite overlap with the allSprites group.'
					);
				}
				if (w !== undefined && h === undefined) this.shape = 'circle';
				else {
					this.shape = 'box';
					this.h = h;
				}
			}

			/**
			 * The sprite's position on the previous frame.
			 * @type {object}
			 */
			this.prevPos = { x, y };
			this.prevRotation = 0;
			this._dest = { x, y };
			this._destIdx = 0;
			this._debug = false;

			/**
			 * Text displayed at the center of the sprite.
			 * @type {String}
			 * @default undefined
			 */
			this.text;

			if (!group._isAllSpritesGroup) $.allSprites.push(this);
			group.push(this);

			let gvx = group.vel.x || 0;
			let gvy = group.vel.y || 0;
			if (typeof gvx == 'function') gvx = gvx(group.length - 1);
			if (typeof gvy == 'function') gvy = gvy(group.length - 1);
			this.vel.x = gvx;
			this.vel.y = gvy;

			// skip these properties
			let skipProps = [
				'ani',
				'collider',
				'x',
				'y',
				'w',
				'h',
				'd',
				'diameter',
				'dynamic',
				'height',
				'kinematic',
				'static',
				'vel',
				'width'
			];

			// inherit properties from group in the order they were added
			// skip props that were already set above
			for (let prop of $.Sprite.propsAll) {
				if (skipProps.includes(prop)) continue;
				let val = group[prop];
				if (val === undefined) continue;
				if (typeof val == 'function' && isArrowFunction(val)) {
					val = val(group.length - 1);
				}
				if (typeof val == 'object') {
					if (val instanceof p5.Color) {
						this[prop] = $.color(...val.levels);
					} else {
						this[prop] = Object.assign({}, val);
					}
				} else {
					this[prop] = val;
				}
			}

			skipProps = [
				'add',
				'animation',
				'animations',
				'autoCull',
				'contains',
				'GroupSprite',
				'Group',
				'idNum',
				'length',
				'mod',
				'mouse',
				'p',
				'parent',
				'Sprite',
				'Subgroup',
				'subgroups',
				'velocity'
			];

			for (let i = 0; i < this.groups.length; i++) {
				let g = this.groups[i];
				let props = Object.keys(g);
				for (let prop of props) {
					if (!isNaN(prop) || prop[0] == '_' || skipProps.includes(prop) || $.Sprite.propsAll.includes(prop)) {
						continue;
					}
					let val = g[prop];
					if (val === undefined) continue;
					if (typeof val == 'function' && isArrowFunction(val)) {
						val = val(g.length - 1);
					}
					if (typeof val == 'object') {
						this[prop] = Object.assign({}, val);
					} else {
						this[prop] = val;
					}
				}
			}

			{
				let r = $.random(0.12, 0.96);
				let g = $.random(0.12, 0.96);
				let b = $.random(0.12, 0.96);

				if ($._colorFormat != 1) {
					r *= 255;
					g *= 255;
					b *= 255;
				}

				// "random" color that's not too dark or too light
				this.color ??= $.color(r, g, b);
			}

			this._textFill ??= $.color(0);
			this._textSize ??= this.tileSize == 1 ? ($.canvas ? $.textSize() : 12) : 0.8;
		}

		/**
		 * Adds a collider (fixture) to the sprite's physics body.
		 *
		 * It accepts parameters in a similar format to the Sprite
		 * constructor except the first two parameters are x and y offsets,
		 * the distance new collider should be from the center of the sprite.
		 *
		 * This function also recalculates the sprite's mass based on the
		 * size of the new collider added to it. However, it does not move
		 * the sprite's center of mass, which makes adding multiple colliders
		 * to a sprite easier.
		 *
		 * For better physics simulation results, run the `resetCenterOfMass`
		 * function after you finish adding colliders to a sprite.
		 *
		 * One limitation of the current implementation is that sprites
		 * with multiple colliders can't have their collider
		 * type changed without losing every collider added to the
		 * sprite besides the first.
		 *
		 * @param {Number} offsetX - distance from the center of the sprite
		 * @param {Number} offsetY - distance from the center of the sprite
		 * @param {Number} w - width of the collider
		 * @param {Number} h - height of the collider
		 */
		addCollider(offsetX, offsetY, w, h) {
			if (this._removed) {
				console.error("Can't add colliders to a sprite that was removed.");
				return;
			}
			if (this.__collider == 3) {
				this._collider = 'dynamic';
				this.__collider = 0;
			}
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
				this.body = $.world.createBody({
					position: scaleTo(this.x, this.y, this.tileSize),
					type: this.collider
				});
				this.body.sprite = this;
			} else this.body.m_gravityScale ||= 1;

			let com = new pl.Vec2(this.body.getLocalCenter());

			// mass is recalculated in createFixture
			this.body.createFixture(props);
			if (this.watch) this.mod[19] = true;

			// reset the center of mass to the sprite's center
			this.body.setMassData({
				mass: this.body.getMass(),
				center: com,
				I: this.body.getInertia()
			});
		}

		/**
		 * Adds a sensor to the sprite's physics body.
		 *
		 * Sensors can't displace or be displaced by colliders.
		 * Sensors don't have any mass or other physical properties.
		 * Sensors simply detect overlaps with other sensors.
		 *
		 * This function accepts parameters in a similar format to the Sprite
		 * constructor except the first two parameters are x and y offsets,
		 * the relative distance the new sensor should be from the center of
		 * the sprite.
		 *
		 * If a sensor is added to a sprite that has no collider (type "none")
		 * then internally it will be given a dynamic physics body that isn't
		 * affected by gravity so that the sensor can be added to it.
		 *
		 * @param {Number} offsetX - distance from the center of the sprite
		 * @param {Number} offsetY - distance from the center of the sprite
		 * @param {Number} w - width of the collider
		 * @param {Number} h - height of the collider
		 */
		addSensor(offsetX, offsetY, w, h) {
			if (this._removed) {
				console.error("Can't add sensors to a sprite that was removed.");
				return;
			}
			let s = this._parseShape(...arguments);
			if (!this.body) {
				this.body = $.world.createBody({
					position: scaleTo(this.x, this.y, this.tileSize),
					type: 'dynamic',
					gravityScale: 0
				});
				this.body.sprite = this;
				this.mass = 0;
				this._massUndef = true;
				this.rotation = this._rotation;
				this.vel = this._velocity;
			}
			this.body.createFixture({
				shape: s,
				isSensor: true
			});
			this._sortFixtures();
			this._hasSensors = true;
		}

		_parseShape(offsetX, offsetY, w, h) {
			let args = [...arguments];
			let path, shape;

			if (args.length == 0) {
				offsetX = 0;
				offsetY = 0;
				w = this._w;
				h = this._h;
			} else if (args.length <= 2) {
				offsetX = 0;
				offsetY = 0;
				w = args[0];
				h = args[1];
				this._vertexMode = true;
			}

			let dimensions;

			// if (w is vertex array) or (side length and h is a
			// collider type or the name of a regular polygon)
			if (Array.isArray(w) || typeof h == 'string') {
				if (!isNaN(w)) w = Number(w);
				if (typeof w != 'number' && Array.isArray(w[0])) {
					this._originMode ??= 'start';
				}
				if (typeof h == 'string') {
					path = getRegularPolygon(w, h);
					h = undefined;
				} else {
					path = w;
				}
			} else {
				if (w !== undefined && h === undefined) {
					shape = 'circle';
				} else {
					shape = 'box';
				}
				w ??= this.tileSize > 1 ? 1 : 50;
				h ??= w;

				// the actual dimensions of the collider for a box or circle are a
				// little bit smaller so that they can slid past each other
				// when in a tile grid
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
						if (!this.fixture || !this._relativeOrigin) {
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
							if (i == 0 && !this.fixture) continue;
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
							vert.x += len * $.cos(ang);
							vert.y += len * $.sin(ang);
							vecs.push({ x: vert.x, y: vert.y });

							checkVert();
						}
						ang *= mod;
					}
				}

				let isConvex = false;
				if (
					isSlop(Math.abs(vecs[0].x) - Math.abs(vecs[vecs.length - 1].x)) &&
					isSlop(Math.abs(vecs[0].y) - Math.abs(vecs[vecs.length - 1].y))
				) {
					if (this._shape != 'chain') shape = 'polygon';
					else shape = 'chain';
					this._originMode = 'center';
					if (this._isConvexPoly(vecs.slice(0, -1))) isConvex = true;
				} else {
					shape = 'chain';
				}

				w = max.x - min.x;
				h = max.y - min.y;

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

					if (!this.fixture) {
						this._relativeOrigin = { x: centerX, y: centerY };
					}

					if (this._vertexMode && usesVertices) {
						if (!this.fixture) {
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
			this.shape ??= shape;

			if (!this.fixtureList) {
				this._w = w;
				this._hw = w * 0.5;
				if (this.__shape != 1) {
					this._h = h;
					this._hh = h * 0.5;
				}
			} else {
				// top, bottom, left, right
				this._extents ??= { t: this.hh, b: this.hh, l: this._hw, r: this._hw };
				let ex = this._extents;
				let l = offsetX - w * 0.5;
				let r = offsetX + w * 0.5;
				let t = offsetY - h * 0.5;
				let b = offsetY + h * 0.5;
				if (l < ex.l) ex.l = l;
				if (r > ex.r) ex.r = r;
				if (t < ex.t) ex.t = t;
				if (b > ex.b) ex.b = b;
				this._totalWidth = ex.r - ex.l;
				this._totalHeight = ex.b - ex.t;
				let abs = Math.abs;
				this._largestExtent = Math.max(abs(ex.l), abs(ex.r), abs(ex.t), abs(ex.b));
			}

			return s;
		}

		/**
		 * Removes the physics body colliders from the sprite but not
		 * overlap sensors.
		 */
		removeColliders() {
			if (!this.body) return;
			this._removeContacts(0);
			this._removeFixtures(0);
		}

		/**
		 * Removes overlap sensors from the sprite.
		 */
		removeSensors() {
			if (!this.body) return;
			this._removeContacts(1);
			this._removeFixtures(1);
			this._hasSensors = false;
		}

		/*
		 * removes sensors or colliders or both
		 * @param type can be undefined, 0, or 1
		 * undefined removes both
		 * 0 removes colliders
		 * 1 removes sensors
		 */
		_removeFixtures(type) {
			let prevFxt;
			for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
				if (type === undefined || fxt.m_isSensor == type) {
					let _fxt = fxt.m_next;
					fxt.destroyProxies($.world.m_broadPhase);
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

		/*
		 * Removes contacts
		 * @param type can be undefined, 0, or 1
		 * undefined removes both
		 * 0 removes colliders
		 * 1 removes sensors
		 */
		_removeContacts(type) {
			if (!this.body) return;
			let ce = this.body.m_contactList;
			while (ce) {
				let con = ce.contact;
				ce = ce.next;
				if (type === undefined || con.m_fixtureA.m_isSensor == type) {
					$.world.destroyContact(con);
				}
			}
		}

		_offsetCenterBy(x, y) {
			if (!x && !y) return;

			this._offset._x += x;
			this._offset._y += y;

			if (!this.body) return;

			let off = scaleTo(x, y, this.tileSize);
			this.__offsetCenterBy(off.x, off.y);
		}

		__offsetCenterBy(x, y) {
			for (let fxt = this.body.m_fixtureList; fxt; fxt = fxt.m_next) {
				let shape = fxt.m_shape;
				if (shape.m_type != 'circle') {
					let vertices = shape.m_vertices;
					for (let v of vertices) {
						v.x += x;
						v.y += y;
					}
				} else {
					shape.m_p.x += x;
					shape.m_p.y += y;
				}
			}
		}

		/*
		 * Clones the collider's props to be transferred to a new collider.
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
			// if mass or dimensions were defined by the user,
			// then the mass setting should be copied to the new body
			// else the new body's mass should be calculated based
			// on its dimensions
			if (!this._massUndef || !this._dimensionsUndef) {
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

		/**
		 * Reference to the sprite's current animation.
		 * @type {Ani}
		 */
		get animation() {
			return this._ani;
		}
		set animation(val) {
			this.changeAni(val);
		}

		/**
		 * Reference to the sprite's current animation.
		 * @type {Ani}
		 */
		get ani() {
			return this._ani;
		}
		set ani(val) {
			this.changeAni(val);
		}

		/**
		 * Keys are the animation label, values are Ani objects
		 * @type {Anis}
		 */
		get anis() {
			return this.animations;
		}

		/**
		 * Controls whether a sprite is updated before each physics update,
		 * when users let p5play automatically manage the frame cycle.
		 * @type {Boolean}
		 * @default true
		 */
		get autoUpdate() {
			return this._autoUpdate;
		}
		set autoUpdate(val) {
			this._autoUpdate = val;
		}

		/**
		 * Controls whether a sprite is drawn after each physics update,
		 * when users let p5play automatically manage the frame cycle.
		 * @type {Boolean}
		 * @default true
		 */
		get autoDraw() {
			return this._autoDraw;
		}
		set autoDraw(val) {
			this._autoDraw = val;
		}

		/**
		 * Controls the ability for a sprite to "sleep".
		 *
		 * "Sleeping" sprites are not included in the physics simulation, a
		 * sprite starts "sleeping" when it stops moving and doesn't collide
		 * with anything that it wasn't already touching.
		 * @type {Boolean}
		 * @default true
		 */
		get allowSleeping() {
			return this.body?.isSleepingAllowed();
		}
		set allowSleeping(val) {
			if (this.watch) this.mod[5] = true;
			if (this.body) this.body.setSleepingAllowed(val);
		}

		/**
		 * The bounciness of the sprite's physics body.
		 * @type {Number}
		 * @default 0.2
		 */
		get bounciness() {
			if (!this.fixture) return;
			return this.fixture.getRestitution();
		}
		set bounciness(val) {
			if (this.watch) this.mod[7] = true;
			for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
				fxt.setRestitution(val);
			}
		}

		/**
		 * The sprite's collider type. Default is "dynamic".
		 *
		 * The collider type can be one of the following strings:
		 * "dynamic", "static", "kinematic", "none".
		 *
		 * The letters "d", "s", "k", "n" can be used as shorthand.
		 *
		 * When a sprite with a collider type of "d", "s", or "k" is
		 * changed to "none", or vice versa, the sprite will
		 * maintain its current position, velocity, rotation, and
		 * rotation speed.
		 *
		 * Sprites can't have their collider type
		 * set to "none" if they have a polygon or chain collider,
		 * multiple colliders, or multiple sensors.
		 *
		 * To achieve the same effect as setting collider type
		 * to "none", use `.overlaps(allSprites)` to have your
		 * sprite overlap with all sprites.
		 *
		 * @type {String}
		 * @default 'dynamic'
		 */
		get collider() {
			return this._collider;
		}
		set collider(val) {
			if (val == this._collider) return;

			val = val.toLowerCase();
			let c = val[0];
			if (c == 'd') val = 'dynamic';
			if (c == 's') val = 'static';
			if (c == 'k') val = 'kinematic';
			if (c == 'n') val = 'none';

			if (val == this._collider) return;

			if (val == 'none' && (this._shape == 'chain' || this._shape == 'polygon')) {
				console.error(
					'Cannot set the collider type of a polygon or chain collider to "none". To achieve the same effect, use .overlaps(allSprites) to have your sprite overlap with the allSprites group.'
				);
				return;
			}

			if (this._removed) {
				throw new Error('Cannot change the collider type of a sprite that was removed.');
			}

			let oldCollider = this.__collider;

			this._collider = val;
			this.__collider = ['d', 's', 'k', 'n'].indexOf(c);

			if (this.watch) this.mod[8] = true;

			if (oldCollider === undefined) return;

			if (this.__collider != 3) {
				if (this.body) this.body.setType(val);
				if (oldCollider == 3) {
					this.addCollider();
					this.x = this._position.x;
					this.y = this._position.y;
					this.vel.x = this._velocity.x;
					this.vel.y = this._velocity.y;
					this.rotation = this._rotation;
					this.rotationSpeed = this._rotationSpeed;
				}
			} else {
				this.removeColliders();
				if (this.fixture?.m_isSensor) this.body.m_gravityScale = 0;
				else {
					this._syncWithPhysicsBody();
					$.world.destroyBody(this.body);
					this.body = null;
				}
			}
		}

		_syncWithPhysicsBody() {
			this._position.x = this.x;
			this._position.y = this.y;
			this._velocity.x = this.vel.x;
			this._velocity.y = this.vel.y;
			this._rotation = this.rotation;
			this._rotationSpeed = this.rotationSpeed;
		}

		_parseColor(val) {
			// false if color was copied with Object.assign
			if (val instanceof p5.Color) {
				return val;
			} else if (typeof val != 'object') {
				if (val.length == 1) return $.colorPal(val);
				else return $.color(val);
			}
			return $.color(...val.levels);
		}

		/**
		 * The sprite's current color. By default sprites get a random color.
		 * @type {Color}
		 * @default random color
		 */
		get color() {
			return this._color;
		}
		set color(val) {
			if (this.watch) this.mod[9] = true;
			this._color = this._parseColor(val);
		}
		/**
		 * Alias for color. colour is the British English spelling.
		 * @type {Color}
		 * @default random color
		 */
		get colour() {
			return this._color;
		}
		set colour(val) {
			this.color = val;
		}
		/**
		 * Alias for sprite.fillColor
		 * @type {Color}
		 * @default random color
		 */
		get fill() {
			return this._color;
		}
		set fill(val) {
			this.color = val;
		}

		/**
		 * Overrides sprite's stroke color. By default the stroke of a sprite
		 * is determined by its collider type, which can also be overridden
		 * by the sketch's stroke color.
		 * @type {Color}
		 * @default undefined
		 */
		get stroke() {
			return this._stroke;
		}
		set stroke(val) {
			if (this.watch) this.mod[29] = true;
			this._stroke = this._parseColor(val);
		}

		/**
		 * The sprite's stroke weight, the thickness of its outline.
		 * @type {Number}
		 * @default undefined
		 */
		get strokeWeight() {
			return this._strokeWeight;
		}
		set strokeWeight(val) {
			if (this.watch) this.mod[30] = true;
			this._strokeWeight = val;
		}

		/**
		 * The sprite's text fill color. Black by default.
		 * @type {Color}
		 * @default black (#000000)
		 */
		get textColor() {
			return this._textFill;
		}
		set textColor(val) {
			if (this.watch) this.mod[32] = true;
			this._textFill = this._parseColor(val);
		}
		get textColour() {
			return this._textFill;
		}
		set textColour(val) {
			this.textColor = val;
		}
		/**
		 * The sprite's text fill color. Black by default.
		 * @type {Color}
		 * @default black (#000000)
		 */
		get textFill() {
			return this._textFill;
		}
		set textFill(val) {
			this.textColor = val;
		}

		/**
		 * The sprite's text size, the sketch's current textSize by default.
		 * @type {Number}
		 */
		get textSize() {
			return this._textSize;
		}
		set textSize(val) {
			if (this.watch) this.mod[33] = true;
			this._textSize = val;
		}

		/**
		 * The sprite's text stroke color.
		 * No stroke by default, does not inherit from the sketch's stroke color.
		 * @type {Color}
		 * @default undefined
		 */
		get textStroke() {
			return this._textStroke;
		}
		set textStroke(val) {
			if (this.watch) this.mod[34] = true;
			this._textStroke = this._parseColor(val);
		}

		/**
		 * The sprite's text stroke weight, the thickness of its outline.
		 * No stroke by default, does not inherit from the sketch's stroke weight.
		 * @type {Number}
		 * @default undefined
		 */
		get textStrokeWeight() {
			return this._textStrokeWeight;
		}
		set textStrokeWeight(val) {
			if (this.watch) this.mod[35] = true;
			this._textStrokeWeight = val;
		}

		/**
		 * The tile string represents the sprite in a tile map.
		 * @type {String}
		 */
		get tile() {
			return this._tile;
		}
		set tile(val) {
			if (this.watch) this.mod[36] = true;
			this._tile = val;
		}

		/**
		 * DEPRECATED: Will be removed in version 4.
		 *
		 * The tile size is used to change the size of one unit of
		 * measurement for the sprite.
		 *
		 * For example, if the tile size is 16, then a sprite with
		 * x=1 and y=1 will be drawn at position (16, 16) on the canvas.
		 * @deprecated
		 * @type {Number}
		 * @default 1
		 */
		get tileSize() {
			return this._tileSize;
		}
		set tileSize(val) {
			if (this.watch) this.mod[37] = true;
			this._tileSize = val;
		}

		/**
		 * A bearing indicates the direction that needs to be followed to
		 * reach a destination. Setting a sprite's bearing doesn't do
		 * anything by itself. You can apply a force at the sprite's
		 * bearing angle using the `applyForce` function.
		 * @type {Number}
		 * @example
		 * sprite.bearing = angle;
		 * sprite.applyForce(amount);
		 */
		get bearing() {
			return this._bearing;
		}
		set bearing(val) {
			if (this.watch) this.mod[6] = true;
			this._bearing = val;
		}

		/**
		 * If true, an outline of the sprite's collider will be drawn.
		 * @type {Boolean}
		 * @default false
		 */
		get debug() {
			return this._debug;
		}
		set debug(val) {
			if (this.watch) this.mod[10] = true;
			this._debug = val;
		}

		/**
		 * The density of the sprite's physics body.
		 * @type {Number}
		 * @default 5
		 */
		get density() {
			if (!this.fixture) return;
			return this.fixture.getDensity();
		}
		set density(val) {
			if (this.watch) this.mod[11] = true;
			for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
				fxt.setDensity(val);
			}
		}

		_getDirectionAngle(name) {
			name = name.toLowerCase().replaceAll(/[ _-]/g, '');
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
			let val = dirs[name];
			if ($._angleMode == 'radians') {
				val = $.radians(val);
			}
			return val;
		}
		/**
		 * The angle of the sprite's movement.
		 * @type {Number}
		 * @default 0 ("right")
		 */
		get direction() {
			if (this.vel.x !== 0 || this.vel.y !== 0) {
				return $.atan2(this.vel.y, this.vel.x);
			}
			if (this._isTurtleSprite) return this.rotation;
			return this._direction;
		}
		set direction(val) {
			if (this.watch) this.mod[12] = true;
			if (typeof val == 'string') {
				this._heading = val;
				val = this._getDirectionAngle(val);
			}
			this._direction = val;
			if (this._isTurtleSprite) this.rotation = val;
			let speed = this.speed;
			this.vel.x = $.cos(val) * speed;
			this.vel.y = $.sin(val) * speed;
		}

		/**
		 * The amount of resistance a sprite has to being moved.
		 * @type {Number}
		 * @default 0
		 */
		get drag() {
			return this.body?.getLinearDamping();
		}
		set drag(val) {
			if (this.watch) this.mod[13] = true;
			if (this.body) this.body.setLinearDamping(val);
		}

		/**
		 * Displays the sprite.
		 *
		 * This function is called automatically at the end of each
		 * sketch `draw` function call but it can also be run
		 * by users to customize the order sprites are drawn in relation
		 * to other stuff drawn to the canvas. Also see the sprite.layer
		 * property.
		 *
		 * A sprite's draw function can be overridden with a
		 * custom draw function, inside this function (0, 0) is the center of
		 * the sprite.
		 *
		 * Using this function actually calls the sprite's internal `_display`
		 * function, which sets up the canvas for drawing the sprite before
		 * calling the sprite's `_draw` function. See the example below for how to
		 * run the sprite's default `_draw` function inside your custom `draw` function.
		 *
		 * @type {Function}
		 * @example
		 * let defaultDraw = sprite._draw;
		 *
		 * sprite.draw = function() {
		 *   // add custom code here
		 *   defaultDraw();
		 * }
		 */
		get draw() {
			return this._display;
		}
		set draw(val) {
			this._userDefinedDraw = true;
			this._draw = val;
		}

		/**
		 * True if the sprite's physics body is dynamic.
		 * @type {Boolean}
		 * @default true
		 */
		get dynamic() {
			return this.body?.isDynamic();
		}
		set dynamic(val) {
			if (val) this.collider = 'dynamic';
			else this.collider = 'kinematic';
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
		 * @type {Number}
		 * @default 0.5
		 */
		get friction() {
			if (!this.fixture) return;
			return this.fixture.getFriction();
		}
		set friction(val) {
			if (this.watch) this.mod[14] = true;
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
		 * Alias for `sprite.image`.
		 * @type {Image}
		 */
		get img() {
			return this._img || this._ani?.frameImage;
		}
		set img(val) {
			this.image = val;
		}

		/**
		 * The sprite's image or current frame of animation.
		 *
		 * When `sprite.image` is set, two properties are added:
		 *
		 * `sprite.image.offset` determines the x and y position the image
		 * should be drawn at relative to the sprite's center.
		 *
		 * `sprite.image.scale` determines the x and y scale of the image.
		 * @type {Image}
		 */
		get image() {
			return this._img || this._ani?.frameImage;
		}
		set image(img) {
			if (typeof img == 'string') {
				if (!img.includes('.')) {
					img = new $.EmojiImage(img, this.w);
				} else img = $.loadImage(img);
			}
			this._img = this._extendImage(img);
		}

		_extendImage(img) {
			img.offset ??= { x: 0, y: 0 };
			img._scale ??= { x: 1, y: 1 };
			if (!img.scale) {
				Object.defineProperty(img, 'scale', {
					get: () => img._scale,
					set: (val) => {
						if (typeof val == 'number') val = { x: val, y: val };
						img._scale = val;
					}
				});
			}
			return img;
		}

		/**
		 * Read only. True if the sprite is moving.
		 * @type {Boolean}
		 */
		get isMoving() {
			return this.vel.x != 0 || this.vel.y != 0;
		}

		/**
		 * Set this to true if the sprite goes really fast to prevent
		 * inaccurate physics simulation.
		 * @type {Boolean}
		 * @default false
		 */
		get isSuperFast() {
			return this.body?.isBullet();
		}
		set isSuperFast(val) {
			if (this.watch) this.mod[16] = true;
			if (this.body) this.body.setBullet(val);
		}

		/**
		 * True if the sprite's physics body is kinematic.
		 * @type {Boolean}
		 * @default false
		 */
		get kinematic() {
			return this.body?.isKinematic();
		}
		set kinematic(val) {
			if (val) this.collider = 'kinematic';
			else this.collider = 'dynamic';
		}
		/**
		 * By default sprites are drawn in the order they were created in.
		 * You can change the draw order by editing sprite's layer
		 * property. Sprites with the highest layer value get drawn first.
		 * @type {Number}
		 */
		get layer() {
			return this._layer;
		}
		set layer(val) {
			if (this.watch) this.mod[17] = true;
			this._layer = val;
		}
		/**
		 * When the physics simulation is progressed in `world.physicsUpdate`,
		 * each sprite's life is decreased by `world.timeScale`.
		 *
		 * If life becomes less than or equal to 0, the sprite will
		 * be removed.
		 *
		 * It must be set to a positive integer lower than the max value of
		 * a 32 bit signed integer, 2147483647, which is the default value
		 * representing infinite life. This limitation makes sprite netcode
		 * smaller. But don't worry, at 60 fps this gives users a definable
		 * sprite life range between 1 frame and ~411 days!
		 * @type {Number}
		 * @default 2147483647
		 */
		get life() {
			return this._life;
		}
		set life(val) {
			if (this.watch) this.mod[18] = true;
			this._life = val;
		}

		/**
		 * The mass of the sprite's physics body.
		 * @type {Number}
		 */
		get mass() {
			return this.body?.getMass();
		}
		set mass(val) {
			if (!this.body) return;
			if (this.watch) this.mod[19] = true;
			const com = new pl.Vec2(this.body.getLocalCenter());
			const t = { I: 0, center: com, mass: 0 };
			this.body.getMassData(t);
			t.mass = val > 0 ? val : 0.00000001;
			this.body.setMassData(t);
			delete this._massUndef;
		}

		/**
		 * Recalculates the sprite's mass based on its current
		 * density and size.
		 *
		 * Does not change the sprite's center of mass, to do so
		 * use the `resetCenterOfMass` function.
		 */
		resetMass() {
			if (!this.body) return;
			let com = new pl.Vec2(this.body.getLocalCenter());

			if (this.watch) this.mod[19] = true;
			this.body.resetMassData();

			// reset the center of mass to the sprite's center
			this.body.setMassData({
				mass: this.body.getMass(),
				center: com,
				I: this.body.getInertia()
			});
		}

		/**
		 * Recalculates the sprite's center of mass based on the masses of
		 * its fixtures and their positions. Moves the sprite's center to
		 * the new center of mass, but doesn't actually change the positions
		 * of its fixtures relative to the world.
		 *
		 * In p5play a sprite's center (position) is always the same as its
		 * center of mass and center of rotation.
		 */
		resetCenterOfMass() {
			if (this.watch) this.mod[19] = true;
			this.body.resetMassData();

			let { x, y } = this.body.getLocalCenter();
			if (x == 0 && y == 0) return;
			this.__offsetCenterBy(-x, -y);

			// again? yes, to set local center to (0, 0)
			this.body.resetMassData();

			let pos = this.body.getPosition();
			this.body.setPosition({ x: pos.x + x, y: pos.y + y });
		}

		/**
		 * DEPRECATED: Will be removed in version 4.
		 *
		 * Use sprite.scale instead.
		 * @deprecated
		 * @type {Object}
		 * @property {Boolean} x - the sprite's horizontal mirror state
		 * @property {Boolean} y - the sprite's vertical mirror state
		 * @default {x: false, y: false}
		 */
		get mirror() {
			return this._mirror;
		}
		set mirror(val) {
			if (this.watch) this.mod[20] = true;
			if (val.x !== undefined) this._mirror.x = val.x;
			if (val.y !== undefined) this._mirror.y = val.y;
		}

		/**
		 * Offsetting the sprite moves the sprite's physics body relative
		 * to its center.
		 *
		 * The sprite's x and y properties represent its center in world
		 * coordinates. This point is also the sprite's center of rotation.
		 * @type {object}
		 * @property {Number} x - the sprite's horizontal offset
		 * @property {Number} y - the sprite's vertical offset
		 * @default {x: 0, y: 0}
		 */
		get offset() {
			return this._offset;
		}
		set offset(val) {
			val.x ??= this._offset._x;
			val.y ??= this._offset._y;
			if (val.x == this._offset._x && val.y == this._offset._y) return;
			if (this.watch) this.mod[21] = true;
			this._offsetCenterBy(val.x - this._offset._x, val.y - this._offset._y);
		}

		/**
		 * The sprite's opacity. 0 is transparent, 1 is opaque.
		 * @type {Number}
		 * @default 1
		 */
		get opacity() {
			return this._opacity ?? 1;
		}
		set opacity(val) {
			if (this.watch) this.mod[41] = true;
			this._opacity = val;
		}

		/**
		 * Alias for sprite.prevPos
		 * @type {Object}
		 */
		get previousPosition() {
			return this.prevPos;
		}
		set previousPosition(val) {
			this.prevPos = val;
		}

		/**
		 * Alias for sprite.prevRotation
		 * @type {Number}
		 */
		get previousRotation() {
			return this.prevRotation;
		}
		set previousRotation(val) {
			this.prevRotation = val;
		}

		/**
		 * By default p5play draws sprites with subpixel rendering.
		 *
		 * Set pixelPerfect to true to make p5play always display sprites
		 * at integer pixel precision. This is useful for making retro games.
		 * @type {Boolean}
		 * @default false
		 */
		get pixelPerfect() {
			return this._pixelPerfect;
		}
		set pixelPerfect(val) {
			if (this.watch) this.mod[22] = true;
			this._pixelPerfect = val;
		}

		/**
		 * If the sprite has been removed from the world.
		 * @type {Boolean}
		 * @default false
		 */
		get removed() {
			return this._removed;
		}
		set removed(val) {
			if (!val || this._removed) return;
			if (this.watch) this.mod[23] = true;
			this._removed = true;
			this._remove();
		}

		/**
		 * The angle of the sprite's rotation, not the direction it's moving.
		 *
		 * If angleMode is set to "degrees", the value will be returned in
		 * a range of -180 to 180.
		 * @type {Number}
		 * @default 0
		 */
		get rotation() {
			if (!this.body || !usePhysics) return this._rotation || 0;
			let val = this.body.getAngle();
			if ($.p5play.friendlyRounding) val = fixRound(val, angularSlop);
			return $._angleMode == DEGREES ? $.degrees(val) : val;
		}
		set rotation(val) {
			this._rotation = val;

			if (this.body) {
				if ($._angleMode == DEGREES) val = $.radians(val % 360);
				this.body.setAngle(val);
				this.body.synchronizeTransform();
			}
		}
		/**
		 * The amount the sprite resists rotating.
		 * @type {Number}
		 * @default 0
		 */
		get rotationDrag() {
			return this.body?.getAngularDamping();
		}
		set rotationDrag(val) {
			if (!this.body) return;
			if (this.watch) this.mod[24] = true;
			this.body.setAngularDamping(val);
		}
		/**
		 * If true, the sprite can not rotate.
		 * @type {Boolean}
		 * @default false
		 */
		get rotationLock() {
			return this.body?.isFixedRotation();
		}
		set rotationLock(val) {
			if (!this.body) return;
			if (this.watch) this.mod[25] = true;
			let mass = this.mass;
			this.body.setFixedRotation(val);
			this.mass = mass;
		}
		/**
		 * The speed of the sprite's rotation in angles per frame.
		 * @type {Number}
		 * @default 0
		 */
		get rotationSpeed() {
			if (this.body) {
				let val = this.body.getAngularVelocity() / 60;
				return $._angleMode == DEGREES ? $.degrees(val) : val;
			}
			return this._rotationSpeed;
		}
		set rotationSpeed(val) {
			if (this.body) {
				val *= 60;
				if ($._angleMode == DEGREES) val = $.radians(val);
				this.body.setAngularVelocity(val);
			} else this._rotationSpeed = val;
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
		 * @type {Number|Object}
		 * @default 1
		 */
		get scale() {
			return this._scale;
		}
		set scale(val) {
			if (val == 0) val = 0.01;
			if (typeof val === 'number') {
				val = { x: val, y: val };
			} else {
				val.x ??= this._scale._x;
				val.y ??= this._scale._y;
			}
			if (val.x == this._scale._x && val.y == this._scale._y) return;

			if (this.watch) this.mod[26] = true;

			let scalars = {
				x: Math.abs(val.x / this._scale._x),
				y: Math.abs(val.y / this._scale._y)
			};

			this._w *= scalars.x;
			this._hw *= scalars.x;
			if (this._h) {
				this._h *= scalars.y;
				this._hh *= scalars.y;
			}
			this._resizeColliders(scalars);

			this._scale._x = val.x;
			this._scale._y = val.y;
			this._scale._avg = val.x;
		}

		/**
		 * Wake a sprite up or put it to sleep.
		 *
		 * "Sleeping" sprites are not included in the physics simulation, a
		 * sprite starts "sleeping" when it stops moving and doesn't collide
		 * with anything that it wasn't already touching.
		 * @type {Boolean}
		 * @default true
		 */
		get sleeping() {
			if (this.body) return !this.body.isAwake();
			return undefined;
		}
		set sleeping(val) {
			if (!this.body) return;
			if (this.watch) this.mod[28] = true;
			this.body.setAwake(!val);
		}

		/**
		 * The sprite's speed.
		 *
		 * Setting speed to a negative value will make the sprite move
		 * 180 degrees opposite of its current direction angle.
		 * @type {Number}
		 * @default 0
		 */
		get speed() {
			return $.createVector(this.vel.x, this.vel.y).mag();
		}
		set speed(val) {
			let angle = this.direction;
			this.vel.x = $.cos(angle) * val;
			this.vel.y = $.sin(angle) * val;
		}

		/**
		 * Is the sprite's physics collider static?
		 * @type {Boolean}
		 * @default false
		 */
		get static() {
			return this.body?.isStatic();
		}
		set static(val) {
			if (val) this.collider = 'static';
			else this.collider = 'dynamic';
		}

		/**
		 * Tint color applied to the sprite when drawn.
		 *
		 * Note that this is not good for performance, you should probably
		 * pre-render the effect if you want to use it a lot.
		 * @type {Color}
		 * @default undefined
		 */
		get tint() {
			return this._tint;
		}
		set tint(val) {
			if (this.watch) this.mod[38] = true;
			this._tint = this._parseColor(val);
		}

		/**
		 * Alias for sprite.tint
		 * @type {Color}
		 * @default undefined
		 */
		get tintColor() {
			return this._tint;
		}
		set tintColor(val) {
			this.tint = val;
		}

		/**
		 * The sprite's vertices, in vertex mode format.
		 * @type {Array}
		 */
		set vertices(val) {
			if (this.__collider == 3) {
				throw new Error('Cannot set vertices of a sprite with collider type of "none".');
			}
			if (this.watch) this.mod[27] = true;

			this._removeFixtures();

			this._originMode = 'start';
			this.addCollider(val);
			if (this._hasSensors) {
				this.addDefaultSensors();
			}
		}
		get vertices() {
			return this._getVertices();
		}

		_getVertices(internalUse) {
			let f = this.fixture;
			let s = f.getShape();
			let v = [...s.m_vertices];
			if (s.m_type == 'polygon') v.unshift(v.at(-1));
			let x = this.x;
			let y = this.y;
			for (let i = 0; i < v.length; i++) {
				let arr = [(v[i].x / this.tileSize) * $.world.meterSize + x, (v[i].y / this.tileSize) * $.world.meterSize + y];
				if ($.p5play.friendlyRounding) {
					arr[0] = fixRound(arr[0]);
					arr[1] = fixRound(arr[1]);
				}
				if (internalUse) v[i] = arr;
				else v[i] = $.createVector(arr[0], arr[1]);
			}
			return v;
		}

		/**
		 * If true the sprite is shown, if set to false the sprite is hidden.
		 *
		 * Becomes null when the sprite is off screen but will be drawn and
		 * set to true again if it goes back on screen.
		 * @type {Boolean}
		 * @default true
		 */
		get visible() {
			return this._visible;
		}
		set visible(val) {
			if (this.watch) this.mod[39] = true;
			this._visible = val;
		}

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
		 * @type {Vector}
		 */
		get pos() {
			return this._pos;
		}
		set pos(val) {
			if (this.body) {
				let pos = new pl.Vec2((val.x * this.tileSize) / $.world.meterSize, (val.y * this.tileSize) / $.world.meterSize);
				this.body.setPosition(pos);
			}
			this._position.x = val.x;
			this._position.y = val.y;
		}
		/**
		 * The position vector {x, y}
		 * @type {Vector}
		 */
		get position() {
			return this._pos;
		}
		set position(val) {
			this.pos = val;
		}
		/**
		 * The sprite's absolute position on the canvas. Read only.
		 */
		get canvasPos() {
			return this._canvasPos;
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
			if (this.watch) this.mod[40] = true;

			let scalarX = val / this._w;
			this._w = val;
			this._hw = val * 0.5;
			this._resizeColliders({ x: scalarX, y: 1 });
			delete this._widthUndef;
			delete this._dimensionsUndef;
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
			return this._w;
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
			return this._h || this._w;
		}
		set h(val) {
			if (val < 0) val = 0.01;
			if (this.__shape == 1) {
				this.w = val;
				return;
			}
			if (val == this._h) return;
			if (this.watch) this.mod[15] = true;
			let scalarY = val / this._h;
			this._h = val;
			this._hh = val * 0.5;
			this._resizeColliders({ x: 1, y: scalarY });
			delete this._heightUndef;
			delete this._dimensionsUndef;
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
			return this._w;
		}
		set d(val) {
			if (val < 0) val = 0.01;
			let shapeChange = this.__shape != 1;
			if (!shapeChange && this._w == val) return;

			if (this.watch) this.mod[40] = true;

			if (!shapeChange) {
				let scalar = val / this._w;
				this._resizeColliders({ x: scalar, y: scalar });
			}
			this._w = val;
			this._hw = val * 0.5;
			if (shapeChange) this.shape = 'circle';
		}
		/**
		 * The diameter of a circular sprite.
		 * @type {Number}
		 */
		get diameter() {
			return this._w;
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

		/*
		 * Resizes the the sprite's colliders.
		 * x and y scalars (0-1 values) are used to resize the collider.
		 */
		_resizeColliders(scalars) {
			if (!this.body) return;

			for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
				if (fxt.m_isSensor) continue;
				let sh = fxt.m_shape;
				if (sh.m_type == 'circle') {
					if (scalars.x != 1) sh.m_radius *= scalars.x;
					else sh.m_radius *= scalars.y;
				} else {
					for (let vert of sh.m_vertices) {
						vert.x *= scalars.x;
						vert.y *= scalars.y;
					}
				}
			}
			if (this._widthUndef || this._heightUndef) this.resetMass();
			this.body.synchronizeFixtures();
		}

		/*
		 * Validates convexity.
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
		 * If a sprite with a circle shape has its shape type changed to
		 * chain or polygon, the circle will be turned into a dodecagon.
		 * @type {String}
		 * @default box
		 */
		get shape() {
			return this._shape;
		}
		set shape(val) {
			if (val == this._shape) return;

			// ['box', 'circle', 'chain', 'polygon']
			let __shape = $.Sprite.shapeTypes.indexOf(val);
			if (__shape == -1) {
				throw new Error(
					'Invalid shape type: "' + val + '"\nThe valid shape types are: "' + $.Sprite.shapeTypes.join('", "') + '"'
				);
			}

			if (this.__collider == 3 && __shape >= 2) {
				console.error(
					'Cannot set the collider shape to chain or polygon if the sprite has a collider type of "none". To achieve the same effect, use .overlaps(allSprites) to have your sprite overlap with the allSprites group.'
				);
				return;
			}

			let prevShape = this.__shape;
			this.__shape = __shape;
			this._shape = val;

			if (this.watch) this.mod[27] = true;
			if (prevShape === undefined) return;

			if (this.__shape == 0) {
				this._h = this._w;
				this._hh = this._hw;
			} else {
				this._h = undefined;
				this._hh = undefined;
			}

			let v, w;
			if (prevShape != 1 && this.__shape != 1) {
				v = this._getVertices(true);
			} else {
				w = this._w;
			}

			// destroys all (colliders and sensors)
			this._removeFixtures();

			// remake colliders, if collider type is not "none"
			if (this.__collider != 3) {
				if (v) {
					this._originMode ??= 'center';
					this.addCollider(v);
				}
				// turn circle into dodecagon chain/polygon
				else if (prevShape == 1) {
					let side = this._w * Math.sin(Math.PI / 12);
					this.addCollider(0, 0, [side, -30, 12]);
				} else {
					this.addCollider();
				}
			}
			// remake sensors
			if (this._hasSensors) {
				this.addDefaultSensors();
			}

			let ox = this._offset._x;
			let oy = this._offset._y;
			if (!ox && !oy) return;
			this._offset._x = 0;
			this._offset._y = 0;
			this._offsetCenterBy(ox, oy);
		}

		/**
		 * Runs before each physics update by default, when p5play is automatically
		 * managing the frame cycle.
		 *
		 * Set this to a custom function that handles input, directs sprite movement,
		 * and performs other tasks that should run before the physics update.
		 *
		 * Optionally, users can run this function manually in p5play's `update`
		 * function.
		 * @type {Function}
		 */
		get update() {
			return this._update;
		}
		set update(val) {
			this._customUpdate = val;
		}

		/**
		 * Runs at the end of the p5play frame cycle.
		 *
		 * Users should not directly run this function.
		 * @type {Function}
		 */
		get postDraw() {
			return this._postDraw;
		}
		set postDraw(val) {
			this._customPostDraw = val;
		}

		/**
		 * The sprite's velocity vector {x, y}
		 * @type {Vector}
		 * @default {x: 0, y: 0}
		 */
		get vel() {
			return this._vel;
		}
		set vel(val) {
			this.vel.x = val.x;
			this.vel.y = val.y;
		}

		/**
		 * The sprite's velocity vector {x, y}
		 * @type {Vector}
		 * @default {x: 0, y: 0}
		 */
		get velocity() {
			return this._vel;
		}
		set velocity(val) {
			this.vel = val;
		}

		/**
		 * A ratio that defines how much the sprite is affected by gravity.
		 * @type {Number}
		 * @default 1
		 */
		get gravityScale() {
			return this.body?.getGravityScale();
		}
		set gravityScale(val) {
			if (!this.body) return;
			if (this.watch) this.mod[42] = true;
			this.body.setGravityScale(val);
		}

		_update() {
			if (this._customUpdate) this._customUpdate();
			if (this.autoUpdate) this.autoUpdate = null;
		}

		_step() {
			this.life -= timeScale;
			if (this._life != 2147483647 && this._life <= 0) {
				this.remove();
			}

			if ((!this.body || !usePhysics) && !this._removed) {
				this._position.x += this.vel.x * timeScale;
				this._position.y += this.vel.y * timeScale;
				this._rotation += this._rotationSpeed * timeScale;
			}

			if (this.watch) {
				if (this.x != this.prevX) this.mod[0] = this.mod[2] = true;
				if (this.y != this.prevY) this.mod[1] = this.mod[2] = true;
				if (this.rotation != this.prevRotation) {
					this.mod[3] = this.mod[4] = true;
				}
			}

			if (!this.body && !this._removed) return;

			this.__step();
		}

		//      a -> b
		// sprite -> sprite
		// sprite -> group
		//  group -> group
		__step() {
			// for each type of collision and overlap event
			let a = this;
			let b;
			for (let event in eventTypes) {
				for (let k in this[event]) {
					if (k >= 1000) {
						// if a is group or a is sprite and a._uid >= k
						if (a._isGroup || a._uid >= k) continue;
						b = $.p5play.sprites[k];
					} else {
						// if a is group and a._uid >= k
						if (a._isGroup && a._uid >= k) continue;
						b = $.p5play.groups[k];
					}

					let v = a[event][k] + 1;
					if (!b || v == 0 || v == -2) {
						delete a[event][k];
						if (b) delete b[event][a._uid];
						continue;
					}
					this[event][k] = v;
					b[event][a._uid] = v;
				}
			}
		}

		___step() {
			let a = this;
			let b, contactType, shouldOverlap, cb;
			let checkCollisions = true;
			for (let event in eventTypes) {
				for (let k in this[event]) {
					if (k >= 1000) {
						if (a._isGroup || a._uid >= k) continue;
						b = $.p5play.sprites[k];
					} else {
						if (a._isGroup && a._uid >= k) continue;
						b = $.p5play.groups[k];
					}

					// contact callbacks can only be called between sprites
					if (a._isGroup || b?._isGroup) continue;

					// is there even a chance that a contact callback exists?
					shouldOverlap = a._hasOverlap[b._uid] ?? b._hasOverlap[a._uid];
					if ((checkCollisions && shouldOverlap !== false) || (!checkCollisions && shouldOverlap !== true)) {
						continue;
					}

					let v = a[event][k];
					for (let i = 0; i < 3; i++) {
						if (i == 0 && v != 1 && v != -3) continue;
						if (i == 1 && v == -1) continue;
						if (i == 2 && v >= 1) continue;
						contactType = eventTypes[event][i];

						let la = $.p5play[contactType][a._uid];
						if (la) {
							cb = la[b._uid];
							if (cb) cb.call(a, a, b, v);
							for (let g of b.groups) {
								cb = la[g._uid];
								if (cb) cb.call(a, a, b, v);
							}
						}

						let lb = $.p5play[contactType][b._uid];
						if (lb) {
							cb = lb[a._uid];
							if (cb) cb.call(b, b, a, v);
							for (let g of a.groups) {
								cb = lb[g._uid];
								if (cb && (!la || cb != la[g._uid])) {
									cb.call(b, b, a, v);
								}
							}
						}
					}
				}
				checkCollisions = false;
			}

			// all of p5play's references to a removed sprite can be deleted
			// only if the sprite was not colliding or overlapping with
			// anything or its last collided and overlapped events were handled
			if (this._removed) {
				if (Object.keys(this._collisions).length == 0 && Object.keys(this._overlappers).length == 0) {
					if (this._isSprite) delete $.p5play.sprites[this._uid];
					else if (!$.p5play.storeRemovedGroupRefs) delete $.p5play.groups[this._uid];

					// remove contact events
					for (let eventType in eventTypes) {
						for (let contactType of eventTypes[eventType]) {
							delete $.p5play[contactType][this._uid];
						}
					}
				}
			}
		}

		// default draw
		__draw() {
			if (!$.p5play.disableImages) {
				if (this._ani) {
					this._ani.draw(this._offset._x, this._offset._y, 0, this._scale._x, this._scale._y);
				} else if (this._img) {
					let img = this._img;
					let shouldScale = this._scale._x != 1 || this._scale._y != 1 || img.scale.x != 1 || img.scale.y != 1;
					if (shouldScale) {
						$.push();
						$.scale(this._scale._x * img.scale.x, this._scale._y * img.scale.y);
					}
					$.image(img, this._offset._x + img.offset.x, this._offset._y + img.offset.y);
					if (shouldScale) $.pop();
				}
			}
			if (!(this._ani || this._img) || this.debug || $.p5play.disableImages) {
				if (this.debug) {
					$.noFill();
					$.stroke(0, 255, 0);
					$.line(0, -2, 0, 2);
					$.line(-2, 0, 2, 0);
				}

				if (this.__collider != 3) {
					if (!this.debug && this._strokeWeight !== 0) {
						if (this.__shape == 2) $.stroke(this.stroke || this.color);
						else if (this._stroke) $.stroke(this._stroke);
					} else $.noStroke();
					for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
						if (this.debug) {
							if (!fxt.m_isSensor) $.stroke(0, 255, 0, 127);
							else $.stroke(255, 255, 0, 127);
						} else if (fxt.m_isSensor) continue;
						this._drawFixture(fxt);
					}
				} else {
					if (this._strokeWeight !== 0) $.stroke(this._stroke || 120);
					if (this.__shape == 0) {
						$.rect(this._offset._x, this._offset._y, this.w * this.tileSize, this.h * this.tileSize);
					} else if (this.__shape == 1) {
						$.circle(this._offset._x, this._offset._y, this.d * this.tileSize);
					}
				}
			}
			if (this.text !== undefined) {
				$.textAlign($.CENTER, $.CENTER);
				$.fill(this._textFill);
				if (this._textStrokeWeight) $.strokeWeight(this._textStrokeWeight);
				if (this._textStroke) $.stroke(this._textStroke);
				else $.noStroke();
				$.textSize(this.textSize * this.tileSize);
				$.text(this.text, 0, 0);
			}
		}

		_postDraw() {
			if (this._ani?.update) this._ani.update();

			for (let prop in this.mouse) {
				if (this.mouse[prop] == -1) this.mouse[prop] = 0;
			}

			if (this._customPostDraw) this._customPostDraw();

			this.autoDraw ??= true;
			this.autoUpdate ??= true;
		}

		/*
		 * Applies `rotation`, `mirror` scaling, and `world.origin`
		 * translation before the sprite's `draw` function is called.
		 *
		 * If the sprite is off screen according to the camera's bounds,
		 * `camera.bound`, then the sprite doesn't get drawn.
		 */
		_display() {
			let x = this.x * this.tileSize + $.world.origin.x;
			let y = this.y * this.tileSize + $.world.origin.y;

			if (!this._userDefinedDraw) {
				// For best performance, the sprite will not be drawn if it's offscreen
				// according to the camera's bounds. The largest side of the sprite
				// is used to determine if it's offscreen, since the sprite may be rotated.
				let largestSide;
				if (!this._totalWidth) {
					largestSide = this._h !== undefined ? Math.max(this._w, this._h) : this._w;
				} else {
					largestSide = Math.max(this._totalWidth, this._totalHeight);
				}
				// the sprite may be visually bigger than its collider(s)
				if (this.ani && !$.p5play.disableImages) {
					largestSide = Math.max(largestSide, this.ani.w, this.ani.h);
				}

				if (
					this.shape != 'chain' &&
					$.camera.isActive &&
					(x + largestSide < $.camera.bound.min.x ||
						x - largestSide > $.camera.bound.max.x ||
						y + largestSide < $.camera.bound.min.y ||
						y - largestSide > $.camera.bound.max.y)
				) {
					this._visible = null;
					return;
				}
			}

			this._visible = true;
			$.p5play.spritesDrawn++;

			if (!this._pixelPerfect) {
				x = fixRound(x);
				y = fixRound(y);
			} else {
				let w, h;
				if (this.ani && this.ani.length && !$.p5play.disableImages) {
					w = this.ani[this.ani._frame].w;
					h = this.ani[this.ani._frame].h;
				} else {
					w = this._w;
					h = this._h;
				}
				if (w % 2 == 0) x = Math.round(x);
				else x = Math.round(x - 0.5) + 0.5;
				if (h % 2 == 0) y = Math.round(y);
				else y = Math.round(y - 0.5) + 0.5;
			}

			for (let j of this.joints) {
				if (!j.visible) {
					j.visible ??= true;
					continue;
				}
				if (this._uid == j.spriteA._uid) {
					if (!j.spriteB._visible || this.layer <= j.spriteB.layer) {
						j._display();
					}
				} else if (!j.spriteA._visible || this.layer < j.spriteA.layer) {
					j._display();
				}
			}

			if (this._opacity == 0) return;

			$.push();
			$.imageMode('center');
			$.rectMode('center');
			$.ellipseMode('center');

			$.translate(x, y);
			if (this.rotation) $.rotate(this.rotation);
			if (this._mirror._x != 1 || this._mirror._y != 1) {
				$.scale(this._mirror._x, this._mirror._y);
			}
			$.fill(this.color);
			if (this._strokeWeight !== undefined) {
				$.strokeWeight(this._strokeWeight);
			}
			let ogGlobalAlpha;
			if (this._opacity) {
				ogGlobalAlpha = $.ctx.globalAlpha;
				$.ctx.globalAlpha = this._opacity;
			}
			if (this._tint) $.tint(this._tint);

			this._draw();

			$.pop();
			if (this._opacity) $.ctx.globalAlpha = ogGlobalAlpha;
			this._cameraActiveWhenDrawn = $.camera.isActive;
			if (!$.camera.isActive) $.camera._wasOff = true;

			if (this.autoDraw) this.autoDraw = null;
		}

		/*
		 * Draws a fixture. Used to draw the sprite's physics body.
		 */
		_drawFixture(fxt) {
			const sh = fxt.m_shape;
			if (sh.m_type == 'polygon' || sh.m_type == 'chain') {
				if (sh.m_type == 'chain') {
					if ($._strokeWeight == 0) return;
					$.push();
					$.noFill();
				}
				let v = sh.m_vertices;
				$.beginShape();
				for (let i = 0; i < v.length; i++) {
					$.vertex(v[i].x * $.world.meterSize, v[i].y * $.world.meterSize);
				}
				if (sh.m_type != 'chain') $.endShape('close');
				else {
					$.endShape();
					$.pop();
				}
			} else if (sh.m_type == 'circle') {
				const d = sh.m_radius * 2 * $.world.meterSize;
				$.ellipse(sh.m_p.x * $.world.meterSize, sh.m_p.y * $.world.meterSize, d, d);
			} else if (sh.m_type == 'edge') {
				$.line(
					sh.m_vertex1.x * $.world.meterSize,
					sh.m_vertex1.y * $.world.meterSize,
					sh.m_vertex2.x * $.world.meterSize,
					sh.m_vertex2.y * $.world.meterSize
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

		_parseForceArgs() {
			let args = arguments;
			if (typeof args[0] == 'number' && (args.length == 1 || typeof args[1] != 'number')) {
				args[3] = args[2];
				args[2] = args[1];
				args[1] = $.sin(this._bearing) * args[0];
				args[0] = $.cos(this._bearing) * args[0];
			} else if (args.length == 2 && typeof args[1] != 'number') {
				args[2] = args[1];
				args[1] = undefined;
			}
			let o = {};
			o.forceVector = new pl.Vec2(this._args2Vec(args[0], args[1]));
			if (args[2] !== undefined) {
				o.poa = this._args2Vec(args[2], args[3]);
				o.poa = scaleTo(o.poa.x, o.poa.y, this.tileSize);
			}
			return o;
		}

		/**
		 * If this function is given a force amount, the force is applied
		 * at the angle of the sprite's current bearing. Force can
		 * also be given as a vector.
		 *
		 * The origin of the force can be given as a vector or as x and y
		 * coordinates. If no origin is given, the force is applied to the
		 * center of the sprite.
		 *
		 * @param {Number} amount
		 * @param {Vector} [origin]
		 * @example
		 * sprite.applyForce(amount);
		 * sprite.applyForce(amount, {x: originX, y: originY});
		 * sprite.applyForce(x, y);
		 * sprite.applyForce(x, y, {x: originX, y: originY});
		 * sprite.applyForce({x, y}, {x: originX, y: originY});
		 */
		applyForce(amount, origin) {
			if (!this.body) return;
			if (location.host == 'game.thegamebox.ca') {
				return this.applyForceScaled(...arguments);
			}
			let { forceVector, poa } = this._parseForceArgs(...arguments);
			if (!poa) this.body.applyForceToCenter(forceVector);
			else this.body.applyForce(forceVector, poa);
		}

		/**
		 * Applies a force that's scaled to the sprite's mass.
		 *
		 * @param {Number} amount
		 * @param {Vector} [origin]
		 */
		applyForceScaled(amount, origin) {
			if (!this.body) return;
			let { forceVector, poa } = this._parseForceArgs(...arguments);
			forceVector.mul(this.mass);
			if (!poa) this.body.applyForceToCenter(forceVector);
			else this.body.applyForce(forceVector, poa);
		}

		/**
		 * Applies a force to the sprite's center of mass attracting it to
		 * the given position.
		 *
		 * Radius and easing not implemented yet!
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} force
		 * @param {Number} [radius] - infinite if not given
		 * @param {Number} [easing] - solid if not given
		 * @example
		 * sprite.attractTo(x, y, force);
		 * sprite.attractTo({x, y}, force);
		 */
		attractTo(x, y, force, radius, easing) {
			if (!this.body || this.__collider != 0) {
				console.error('attractTo can only be used on sprites with dynamic colliders');
				return;
			}
			if (typeof x != 'number') {
				let obj = x;
				if (!obj || (obj == $.mouse && !$.mouse.isActive)) return;
				force = y;
				y = obj.y;
				x = obj.x;
			}
			if (this.x == x && this.y == y) return;

			let a = y - this.y;
			let b = x - this.x;
			let c = Math.sqrt(a * a + b * b);

			let percent = force / c;

			let forceVector = new pl.Vec2(b * percent, a * percent);
			this.body.applyForceToCenter(forceVector);
		}

		repelFrom(x, y, force, radius, easing) {
			if (!this.body || this.__collider != 0) {
				console.error('repelFrom can only be used on sprites with dynamic colliders');
				return;
			}
			if (typeof x != 'number') {
				let obj = x;
				if (!obj || (obj == $.mouse && !$.mouse.isActive)) return;
				force = y;
				y = obj.y;
				x = obj.x;
			}
			this.attractTo(x, y, -force, radius, easing);
		}

		/**
		 * Apply a torque on the sprite's physics body.
		 * Torque is the force that causes rotation.
		 * A positive torque will rotate the sprite clockwise.
		 * A negative torque will rotate the sprite counter-clockwise.
		 *
		 * This function is the rotational equivalent of applyForce().
		 * It will not imperatively set the sprite's rotation.
		 *
		 * @param {Number} torque - The amount of torque to apply.
		 */
		applyTorque(val) {
			if (!this.body) return;
			this.body.applyTorque(val);
		}

		/**
		 * Moves a sprite towards a position at a percentage of the distance
		 * between itself and the destination.
		 *
		 * @param {Number|Object} x - destination x or an object with x and y properties
		 * @param {Number} y - destination y
		 * @param {Number} [tracking] - percent of the distance to move towards the destination as a 0-1 value, default is 0.1 (10% tracking)
		 */
		moveTowards(x, y, tracking) {
			if (x === undefined) return;
			if (typeof x != 'number' && x !== null) {
				let obj = x;
				if (obj == $.mouse && !$.mouse.isActive) return;
				if (!obj || obj.x === undefined || obj.y === undefined) {
					throw 'sprite.moveTowards/moveAway ERROR: movement destination not defined.';
				}
				tracking = y;
				y = obj.y;
				x = obj.x;
			}
			tracking ??= 0.1;

			if (x !== undefined && x !== null) {
				let diffX = x - this.x;
				if (!isSlop(diffX)) {
					this.vel.x = diffX * tracking * this.tileSize;
				} else this.vel.x = 0;
			}
			if (y !== undefined && y !== null) {
				let diffY = y - this.y;
				if (!isSlop(diffY)) {
					this.vel.y = diffY * tracking * this.tileSize;
				} else this.vel.y = 0;
			}
		}

		/**
		 * Moves the sprite away from a position, the opposite of moveTowards,
		 * at a percentage of the distance between itself and the position.
		 * @param {Number|Object} x - destination x or an object with x and y properties
		 * @param {Number} y - destination y
		 * @param {Number} [repel] - percent of the distance to the repel position as a 0-1 value, default is 0.1 (10% repel)
		 */
		moveAway(x, y, repel) {
			this.moveTowards(...arguments);
			this.vel.x *= -1;
			this.vel.y *= -1;
		}

		/**
		 * Move the sprite a distance from its current position.
		 *
		 * You can specify the `direction` and `speed` of movement as
		 * parameters or set these properties before using this function.
		 *
		 * When `tileSize` is not 1, distance is divisible by 0.5,
		 * and a direction name or cardinal direction angle is given,
		 * the distance the sprite moves will be rounded up to the
		 * nearest half tile.
		 *
		 * @param {Number} distance
		 * @param {Number|String} [direction] - direction angle in degrees or a cardinal direction name, if not given the sprite's current direction is used
		 * @param {Number} [speed] - if not given, the sprite's current `speed` is used, unless it's 0 then it's given a default speed of 1 or 0.1 if the sprite's tileSize is greater than 1
		 * @returns {Promise} resolves when the movement is complete or cancelled
		 *
		 * @example
		 * sprite.direction = -90;
		 * sprite.speed = 2;
		 * sprite.move(1);
		 * // or
		 * sprite.move(1, -90, 2);
		 * // or
		 * sprite.move('up', 2);
		 */
		move(distance, direction, speed) {
			if (!distance) return Promise.resolve(false);

			let directionNamed = isNaN(arguments[0]);
			if (directionNamed) {
				distance = 1;
				direction = arguments[0];
				speed = arguments[1];
			}

			if (typeof direction == 'string') {
				directionNamed = true;
				this._heading = direction;
				direction = this._getDirectionAngle(direction);
			}
			direction ??= this.direction;

			let x = $.cos(direction) * distance;
			let y = $.sin(direction) * distance;

			if (
				(this.tileSize != 1 || $.p5play.snapToGrid) &&
				(directionNamed || direction % 90 == 0) &&
				distance % $.p5play.gridSize == 0
			) {
				// snap movement to grid
				x = Math.round((this.x + Math.round(x)) / $.p5play.gridSize) * $.p5play.gridSize;
				y = Math.round((this.y + Math.round(y)) / $.p5play.gridSize) * $.p5play.gridSize;
			} else {
				x += this.x;
				y += this.y;
				if (direction % 45 == 0) {
					x = fixRound(x);
					y = fixRound(y);
				}
			}
			return this.moveTo(x, y, speed);
		}

		/**
		 * Move the sprite to a position.
		 *
		 * @param {Number|Object} x - destination x or an object with x and y properties
		 * @param {Number} y - destination y
		 * @param {Number} [speed] - if not given, the sprite's current speed is used, unless it is 0 then it is given a default speed of 1 or 0.1 if the sprite's tileSize is greater than 1
		 * @returns {Promise} resolves to true when the movement is complete
		 * or to false if the sprite will not reach its destination
		 */
		moveTo(x, y, speed) {
			if (typeof x != 'number' && x) {
				let obj = x;
				if (obj == $.mouse && !$.mouse.isActive) return;
				if (!obj || obj.x === undefined || obj.y === undefined) {
					throw 'sprite.moveTo ERROR: destination not defined.';
				}
				speed = y;
				y = obj.y;
				x = obj.x;
			}
			if (x != null && x != this.x) {
				this._dest.x = x;
				x = true;
			} else {
				this._dest.x = this.x;
				x = false;
			}
			if (y != null && y != this.y) {
				this._dest.y = y;
				y = true;
			} else {
				this._dest.y = this.y;
				y = false;
			}
			this._destIdx++;
			if (!x && !y) return Promise.resolve(true);

			speed ??= this.speed || (this.tileSize <= 1 ? 1 : 0.1);
			if (speed <= 0) {
				console.warn('sprite.move: speed should be a positive number');
				return Promise.resolve(false);
			}

			let a = this._dest.y - this.y;
			let b = this._dest.x - this.x;
			let c = Math.sqrt(a * a + b * b);

			let percent = speed / c;

			this.vel.x = b * percent;
			this.vel.y = a * percent;

			// direction destination
			let destD = this.direction < 0 ? this.direction + 360 : this.direction;
			// direction margin of error
			let destDMin = destD - 0.1;
			let destDMax = destD + 0.1;

			let velThresh = $.world.velocityThreshold;
			velThresh = Math.min(velThresh, speed * 0.1);

			// proximity margin of error
			let margin = speed * 0.51 * ($.world.meterSize / 60);

			// if x or y is null, we only care that the sprite
			// reaches the destination along one axis
			let checkDir = x && y;

			let destIdx = this._destIdx;
			return (async () => {
				let distX, distY;
				do {
					await $.sleep();
					if (destIdx != this._destIdx) return false;

					// check if the sprite's movement has been impeded such that
					// its speed has become slower than the world velocityThreshold
					// or if its direction has changed significantly enough so that
					// it will not reach its destination
					let dir = this.direction < 0 ? this.direction + 360 : this.direction;
					if (
						(checkDir && (dir <= destDMin || dir >= destDMax)) ||
						(Math.abs(this.vel.x) <= velThresh && Math.abs(this.vel.y) <= velThresh)
					) {
						return false;
					}

					// check if the sprite has reached its destination
					if (x) {
						if (this.vel.x > 0) distX = this._dest.x - this.x;
						else distX = this.x - this._dest.x;
					}
					if (y) {
						if (this.vel.y > 0) distY = this._dest.y - this.y;
						else distY = this.y - this._dest.y;
					}
				} while ((x && distX > margin) || (y && distY > margin));
				// stop moving the sprite, snap to destination
				this.x = this._dest.x;
				this.y = this._dest.y;
				this.vel.x = 0;
				this.vel.y = 0;
				return true;
			})();
		}

		/**
		 * Rotates the sprite towards an angle or position
		 * with x and y properties.
		 *
		 * @param {Number|Object} angle - angle in degrees or an object with x and y properties
		 * @param {Number} [tracking] - percent of the distance to rotate on each frame towards the target angle, default is 0.1 (10%)
		 * @param {Number} [facing] - (only specify if position is given) rotation angle the sprite should be at when "facing" the position, default is 0
		 */
		rotateTowards(angle, tracking) {
			if (this.__collider == 1) {
				new FriendlyError(0);
				return;
			}

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
		 * to a position or object, as shown in the example.
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
				if (obj == $.mouse && !$.mouse.isActive) return 0;
				if (obj.x === undefined || obj.y === undefined) {
					console.error(
						'sprite.angleTo ERROR: rotation destination not defined, object given with no x or y properties'
					);
					return 0;
				}
				y = obj.y;
				x = obj.x;
			}
			return $.atan2(y - this.y, x - this.x);
		}

		/**
		 * Finds the rotation angle the sprite should be at when "facing"
		 * a position.
		 *
		 * Used internally by `rotateTo`.
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} [facing] - relative angle the sprite should be at when "facing" the position, default is 0
		 * @returns {Number} the rotation angle the sprite should be at when "facing" the position
		 */
		rotationToFace(x, y, facing) {
			if (typeof x == 'object') {
				facing = y;
				y = x.y;
				x = x.x;
			}
			// if the sprite is too close to the position, don't rotate
			if (Math.abs(x - this.x) < 0.01 && Math.abs(y - this.y) < 0.01) {
				return 0;
			}
			return this.angleTo(x, y) + (facing || 0);
		}

		/**
		 * Finds the minimum angle distance that the sprite would have
		 * to rotate to "face" a position at a specified facing rotation,
		 * taking into account the current rotation of the sprite.
		 *
		 * Used internally by `rotateMinTo` and `rotateTowards`.
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} facing - relative angle the sprite should be at when "facing" the position, default is 0
		 * @returns {Number} the minimum angle distance to face the position
		 */
		angleToFace(x, y, facing) {
			let ang = this.rotationToFace(x, y, facing);
			return minAngleDist(ang, this.rotation);
		}

		/**
		 * Rotates the sprite to an angle or to face a position
		 * at a given rotation speed.
		 *
		 * @param {Number|Object} angle - angle or a position object with x and y properties
		 * @param {Number} [speed] - amount of rotation per frame, if not given the sprite's current `rotationSpeed` is used, if 0 it defaults to 1
		 * @param {Number} [facing] - relative angle the sprite should be at when "facing" the given position, default is 0
		 * @returns {Promise} a promise that resolves when the rotation is complete
		 * @example
		 * sprite.rotationSpeed = 2;
		 * sprite.rotateTo(180);
		 * // or
		 * sprite.rotateTo(180, 2);
		 * // or
		 * //             (x, y, speed)
		 * sprite.rotateTo(0, 100, 2);
		 * // or
		 * sprite.rotateTo({x: 0, y: 100}, 2);
		 */
		rotateTo(angle, speed, facing) {
			if (this.__collider == 1) {
				new FriendlyError(0);
				return;
			}

			let args = arguments;
			if (typeof args[0] != 'number') {
				angle = this.rotationToFace(args[0].x, args[0].y, facing);
			} else {
				if (args.length > 2) {
					facing = args[3];
					speed = args[2];
					angle = this.rotationToFace(args[0], args[1], facing);
				}
			}
			if (angle == this.rotation) return;

			let full = $._angleMode == DEGREES ? 360 : $.TWO_PI;
			angle = (angle - this.rotation) % full;
			if (angle < 0 && speed > 0) angle += full;
			if (angle > 0 && speed < 0) angle -= full;

			speed ??= this.rotationSpeed || Math.sign(angle);
			return this.rotate(angle, speed);
		}

		/**
		 * Rotates the sprite by the smallest angular distance
		 * to an angle or to face a position at a given absolute
		 * rotation speed.
		 *
		 * @param {Number|Object} angle - angle or a position object with x and y properties
		 * @param {Number} speed - absolute amount of rotation per frame, if not given the sprite's current `rotationSpeed` is used
		 * @param {Number} facing - relative angle the sprite should be at when "facing" the given position, default is 0
		 */
		rotateMinTo(angle, speed, facing) {
			if (this.__collider == 1) {
				new FriendlyError(0);
				return;
			}
			let args = arguments;
			if (typeof args[0] != 'number') {
				angle = this.rotationToFace(args[0].x, args[0].y, facing);
			} else {
				if (args.length > 2) {
					facing = args[3];
					speed = args[2];
					angle = this.rotationToFace(args[0], args[1], facing);
				}
			}
			if (angle == this.rotation) return;

			angle = minAngleDist(angle, this.rotation);
			speed ??= this.rotationSpeed > 0.1 ? this.rotationSpeed : 1;
			speed = Math.abs(speed) * Math.sign(angle);
			return this.rotate(angle, speed);
		}

		/**
		 * Rotates the sprite by an angle amount at a given rotation speed.
		 *
		 * To achieve a clockwise rotation, use a positive angle and speed.
		 * To achieve a counter-clockwise rotation, use a negative angle
		 * or speed.
		 *
		 * When the rotation is complete, the sprite's rotation speed is
		 * set to 0 and sprite's rotation is set to the exact destination angle.
		 *
		 * If the angle amount is not evenly divisible by the rotation speed,
		 * the sprite's rotation speed will be decreased as it approaches the
		 * destination angle.
		 * @param {Number} angle - the amount to rotate the sprite
		 * @param {Number} [speed] - the absolute amount of rotation per frame, if not given the sprite's current `rotationSpeed` is used, if 0 it defaults to 1
		 * @returns {Promise} a promise that resolves when the rotation is complete
		 */
		rotate(angle, speed) {
			if (this.__collider == 1) {
				new FriendlyError(0);
				return;
			}
			if (isNaN(angle)) {
				new FriendlyError(1, [angle]);
				return;
			}
			if (angle == 0) return;
			speed ??= this.rotationSpeed || 1;

			let cw = angle > 0 && speed > 0; // rotation is clockwise
			if (!cw) {
				angle = -Math.abs(angle);
				speed = -Math.abs(speed);
			}
			this.rotationSpeed = speed;
			let absSpeed = Math.abs(speed);
			let ang = this.rotation + angle; // destination angle

			this._rotateIdx ??= 0;
			this._rotateIdx++;
			let _rotateIdx = this._rotateIdx;

			return (async () => {
				let slop = 0.01;
				do {
					// remaining angular distance to destination
					let remaining = Math.abs(ang - this.rotation);
					if (absSpeed > remaining) {
						this.rotationSpeed = remaining * Math.sign(speed);
					}
					await $.sleep();
					if (this._rotateIdx != _rotateIdx) return false;

					if ((cw && this.rotationSpeed < slop) || (!cw && this.rotationSpeed > -slop)) {
						return false;
					}
				} while (((cw && ang > this.rotation) || (!cw && ang < this.rotation)) && slop < Math.abs(ang - this.rotation));

				this.rotationSpeed = 0;
				this.rotation = ang;
				return true;
			})();
		}

		/**
		 * Adds an animation to the sprite. Use this function in the `preload`
		 * function. You don't need to name the animation if the sprite will only
		 * use one animation. See Ani for more information.
		 *
		 * If an animation was already added to a different sprite or group,
		 * it can not be added to another sprite or group. A clone (copy) of
		 * the animation will be automatically created and added instead.
		 *
		 * @param {String} name - Ani identifier
		 * @param {Ani} animation - The preloaded animation
		 * @example
		 * sprite.addAni(name, animation);
		 * sprite.addAni(name, frame1, frame2, frame3...);
		 * sprite.addAni(name, atlas);
		 */
		addAni() {
			if ($.p5play.disableImages) {
				this._ani = new $.Ani();
				return;
			}
			let args = [...arguments];
			let name, ani;
			if (args[0] instanceof $.Ani) {
				ani = args[0];
				if (ani._addedToSpriteOrGroup) ani = ani.clone();
				name = ani.name || 'default';
				ani.name = name;
			} else if (args[1] instanceof $.Ani) {
				name = args[0];
				ani = args[1];
				if (ani._addedToSpriteOrGroup) ani = ani.clone();
				ani.name = name;
			} else {
				ani = new $.Ani(this, ...args);
				name = ani.name;
			}
			this.animations[name] = ani;
			this._ani = ani;
			ani._addedToSpriteOrGroup = true;

			// only works if the animation was loaded in preload
			if (this._dimensionsUndef && (ani.w != 1 || ani.h != 1)) {
				this.w = ani.w;
				this.h = ani.h;
			}
			return ani;
		}

		/**
		 * Add multiple animations to the sprite.
		 * @param {Object} atlases - an object with animation names as keys and
		 * an animation or animation atlas as values
		 * @example
		 * sprite.addAnis({
		 *   name0: atlas0,
		 *   name1: atlas1
		 * });
		 */
		addAnis() {
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
		}

		/**
		 * Changes the sprite's animation. Use `addAni` to define the
		 * animation(s) first.
		 *
		 * @param {...String} anis - the names of one or many animations to be played in
		 * sequence
		 * @returns A promise that fulfills when the animation or sequence of animations
		 * completes
		 */
		async changeAni(anis) {
			if ($.p5play.disableImages) return;
			if (arguments.length > 1) anis = [...arguments];
			else if (anis instanceof $.Ani) {
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
					ani instanceof $.Ani ||
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
				if (start !== undefined) this._ani._frame = start;

				if (end !== undefined) this._ani.goToFrame(end);
				else if (this._ani._frame == this._ani.lastFrame) resolve();

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
		 * @param {...String} anis - the names of one or many animations to be played in
		 * sequence
		 * @returns A promise that fulfills when the animation or sequence of animations
		 * completes
		 */
		changeAnimation() {
			return this.changeAni(...arguments);
		}

		/*
		 * Changes the displayed animation. The animation must be added first
		 * using the sprite.addAnimation method. The animation could also be
		 * added using the group.addAnimation method to a group the sprite
		 * has been added to.
		 *
		 * See Ani for more control over the sequence.
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
				$.noLoop();
				throw new FriendlyError('Sprite.changeAnimation', [label]);
			}
			this._ani = ani;
			this._ani.name = label;
			// reset to frame 0 of that animation
			if (this.resetAnimationsOnChange) this._ani._frame = 0;
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
			this.removed = true;
		}

		_remove() {
			if (this.body) $.world.destroyBody(this.body);
			this.body = null;

			// when removed from the world also remove all the sprite
			// from all its groups
			for (let g of this.groups) {
				g.remove(this);
			}
		}

		/**
		 * Warning: This function might be changed in a future release.
		 *
		 * Returns the sprite's unique identifier `sprite.idNum`.
		 *
		 * @returns the sprite's id
		 */
		toString() {
			return 's' + this.idNum;
		}

		_setContactCB(target, cb, contactType, eventType) {
			let type;
			if (contactType == 0) type = eventTypes._collisions[eventType];
			else type = eventTypes._overlappers[eventType];

			let ledger = $.p5play[type];

			let l = (ledger[this._uid] ??= {});

			if (l[target._uid] == cb) return;
			l[target._uid] = cb;

			l = ledger[target._uid];
			if (!l || !l[this._uid]) return;
			delete l[this._uid];
			if (Object.keys(l).length == 0) {
				delete ledger[target._uid];
			}
		}

		_validateCollideParams(target, cb) {
			if (!target) {
				throw new FriendlyError('Sprite.collide', 2);
			}
			if (!target._isSprite && !target._isGroup) {
				throw new FriendlyError('Sprite.collide', 0, [target]);
			}
			if (cb && typeof cb != 'function') {
				throw new FriendlyError('Sprite.collide', 1, [cb]);
			}
		}

		_ensureCollide(target, cb, type) {
			if (this._hasOverlap[target._uid] !== false) {
				this._hasOverlap[target._uid] = false;
			}
			if (target._hasOverlap[this._uid] !== false) {
				target._hasOverlap[this._uid] = false;
				if (target._isGroup) {
					for (let s of target) {
						s._hasOverlap[this._uid] = false;
						this._hasOverlap[s._uid] = false;
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
			this._validateCollideParams(target, callback);
			this._ensureCollide(target);
			if (callback) this._setContactCB(target, callback, 0, 0);
			return this._collisions[target._uid] == 1 || this._collisions[target._uid] <= -3;
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
			this._validateCollideParams(target, callback);
			this._ensureCollide(target);
			if (callback) this._setContactCB(target, callback, 0, 1);
			let val = this._collisions[target._uid];
			if (val <= -3) return 1;
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
			this._validateCollideParams(target, callback);
			this._ensureCollide(target);
			if (callback) this._setContactCB(target, callback, 0, 2);
			return this._collisions[target._uid] <= -1;
		}

		_validateOverlapParams(target, cb) {
			if (!target) {
				throw new FriendlyError('Sprite.overlap', 2);
			}
			if (!target._isSprite && !target._isGroup) {
				throw new FriendlyError('Sprite.overlap', 0, [target]);
			}
			if (cb && typeof cb != 'function') {
				throw new FriendlyError('Sprite.overlap', 1, [cb]);
			}
		}

		_ensureOverlap(target) {
			if (!this._hasSensors) this.addDefaultSensors();
			if (!target._hasSensors) {
				if (target._isSprite) {
					target.addDefaultSensors();
				} else {
					for (let s of target) {
						if (!s._hasSensors) s.addDefaultSensors();
					}
					target._hasSensors = true;
				}
			}

			if (!this._hasOverlap[target._uid]) {
				this._removeContactsWith(target);
				this._hasOverlap[target._uid] = true;
			}
			if (!target._hasOverlap[this._uid]) {
				target._removeContactsWith(this);
				target._hasOverlap[this._uid] = true;
				if (target._isGroup) {
					for (let s of target) {
						s._hasOverlap[this._uid] = true;
						this._hasOverlap[s._uid] = true;
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
			this._validateOverlapParams(target, callback);
			this._ensureOverlap(target);
			if (callback) this._setContactCB(target, callback, 1, 0);
			return this._overlappers[target._uid] == 1 || this._overlappers[target._uid] <= -3;
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
			this._validateOverlapParams(target, callback);
			this._ensureOverlap(target);
			if (callback) this._setContactCB(target, callback, 1, 1);
			let val = this._overlappers[target._uid];
			if (val <= -3) return 1;
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
			this._validateOverlapParams(target, callback);
			this._ensureOverlap(target);
			if (callback) this._setContactCB(target, callback, 1, 2);
			return this._overlappers[target._uid] <= -1;
		}

		_removeContactsWith(target) {
			if (target._isGroup) {
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
					$.world.destroyContact(c);
				}
			}
		}

		/*
		 * Internal method called anytime a new sensor is created. Ensures
		 * that sensors are moved to the back of the fixture list.
		 */
		_sortFixtures() {
			let colliders = null;
			let sensors = null;
			let lastColl, lastSens;
			for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
				if (fxt.m_isSensor) {
					if (!sensors) sensors = fxt;
					else sensors.m_next = fxt;
					lastSens = fxt;
				} else {
					if (!colliders) colliders = fxt;
					else colliders.m_next = fxt;
					lastColl = fxt;
				}
			}
			if (sensors) lastSens.m_next = null;
			if (colliders) lastColl.m_next = sensors;
			this.body.m_fixtureList = colliders || sensors;
		}

		/**
		 * This function is used internally if a sprite overlap detection
		 * function is called but the sprite has no overlap sensors.
		 *
		 * It creates sensor fixtures that are the same size as the sprite's
		 * colliders. If you'd like to add more sensors to a sprite, use the
		 * addSensor function.
		 */
		addDefaultSensors() {
			let shape;
			if (this.body && this.fixtureList) {
				for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
					if (fxt.m_isSensor) continue;
					shape = fxt.m_shape;
					this.body.createFixture({
						shape: shape,
						isSensor: true
					});
				}
				this._sortFixtures();
			} else {
				this.addSensor();
			}
			this._hasSensors = true;
		}

		/**
		 * Returns the distance to another sprite, the mouse, a touch,
		 * or any other object with x and y properties. Uses p5's `dist`
		 * function.
		 * @param {Sprite} o object with x and y properties
		 * @returns {Number} distance
		 */
		distanceTo(o) {
			return $.dist(this.x, this.y, o.x, o.y);
		}
	};

	// only used by the p5play-pro Netcode class to convert sprite data to binary
	$.Sprite.propTypes = {
		x: 'Float64', // 0
		y: 'Float64', // 1
		vel: 'Vec2', // 2
		rotation: 'number', // 3
		rotationSpeed: 'number', // 4
		allowSleeping: 'boolean', // 5
		bearing: 'number', // 6
		bounciness: 'number', // 7
		collider: 'Uint8', // 8
		color: 'color', // 9
		debug: 'boolean', // 10
		density: 'number', // 11
		direction: 'number', // 12
		drag: 'number', // 13
		friction: 'number', // 14
		h: 'number', // 15 (height)
		isSuperFast: 'boolean', // 16
		layer: 'number', // 17
		life: 'Int32', // 18
		mass: 'number', // 19
		mirror: 'Vec2_boolean', // 20
		offset: 'Vec2', // 21
		pixelPerfect: 'boolean', // 22
		removed: 'boolean', // 23
		rotationDrag: 'number', // 24
		rotationLock: 'boolean', // 25
		scale: 'Vec2', // 26
		shape: 'Uint8', // 27
		sleeping: 'boolean', // 28
		stroke: 'color', // 29
		strokeWeight: 'number', // 30
		text: 'string', // 31
		textColor: 'color', // 32
		textSize: 'number', // 33
		textStroke: 'color', // 34
		textStrokeWeight: 'number', // 35
		tile: 'string', // 36
		tileSize: 'number', // 37
		tint: 'color', // 38
		visible: 'boolean', // 39
		w: 'number', // 40 (width)
		opacity: 'number', // 41
		gravityScale: 'number' // 42
	};

	$.Sprite.props = Object.keys($.Sprite.propTypes);

	// includes duplicates of some properties
	$.Sprite.propsAll = $.Sprite.props.concat([
		'autoDraw',
		'autoUpdate',
		'colour',
		'd',
		'diameter',
		'dynamic',
		'fill',
		'height',
		'heading',
		'kinematic',
		'resetAnimationsOnChange',
		'speed',
		'spriteSheet',
		'static',
		'textColour',
		'textFill',
		'width'
	]);

	$.Sprite.colliderTypes = ['d', 's', 'k', 'n'];
	$.Sprite.shapeTypes = ['box', 'circle', 'chain', 'polygon'];

	// DEPRECATED: Will be removed in version 4
	$.Turtle = function (size) {
		if ($.allSprites.tileSize > 1) {
			throw new Error(`Turtle can't be used when allSprites.tileSize is greater than 1.`);
		}
		size ??= 25;
		let t = new $.Sprite(size, size, [
			[size, size * 0.4],
			[-size, size * 0.4],
			[0, -size * 0.8]
		]);
		t.color = 'green';
		t._isTurtleSprite = true;
		t._prevPos = { x: t.x, y: t.y };
		let _move = t.move;
		t.move = function () {
			this._prevPos.x = this.x;
			this._prevPos.y = this.y;
			return _move.call(this, ...arguments);
		};
		return t;
	};

	/**
	 * @class
	 * @extends Array<Image>
	 */
	this.Ani = class extends Array {
		/**
		 * <a href="https://p5play.org/learn/animation.html">
		 * Look at the Animation reference pages before reading these docs.
		 * </a>
		 *
		 * An `Ani` object contains an array of images (Q5.Image objects)
		 * that can be displayed with the `animation` function or by
		 * being a sprite's animation.
		 *
		 * An animation can be created multiple ways, including from:
		 * - a list of image file paths as multiple input parameters
		 * - a sequence of numbered images by providing the file path to
		 * the first image frame and last frame index
		 * - a sprite sheet image path and atlas object, frame locator, or
		 * frame locators array (see the Learn page on Ani for more info)
		 *
		 * `Ani` is not a shorthand for `Animation`, since that class name
		 * is already used by the JS Web Animations API.
		 *
		 * @param {...Image} ...images - Image objects to be used as frames
		 * @example
		 * let shapeShifter = new Ani("dog.png", "cat.png", "snake.png");
		 */
		constructor() {
			super();
			let args = [...arguments];

			/**
			 * The name of the animation
			 * @type {String}
			 */
			this.name = 'default';

			let owner;

			if (typeof args[0] == 'object' && (args[0]._isSprite || args[0]._isGroup)) {
				owner = args[0];
				args = args.slice(1);
				this._addedToSpriteOrGroup = true;
			}
			owner ??= $.allSprites;

			if (typeof args[0] == 'string' && (args[0].length == 1 || !args[0].includes('.'))) {
				this.name = args[0];
				args = args.slice(1);
			}

			this._frame = 0;
			this._cycles = 0;
			this.targetFrame = -1;

			/**
			 * The offset is how far the animation should be placed from
			 * the location it is played at.
			 * @type {Object}
			 * @example
			 * ani.offset.x = 16;
			 */
			this.offset = { x: owner.anis.offset.x ?? 0, y: owner.anis.offset.y ?? 0 };

			this._frameDelay = owner.anis.frameDelay || 4;

			this.demoMode = owner.anis.demoMode ?? false;

			/**
			 * True if the animation is currently playing.
			 * @type {Boolean}
			 * @default true
			 */
			this.playing = true;

			/**
			 * Animation visibility.
			 * @type {Boolean}
			 * @default true
			 */
			this.visible = true;

			/**
			 * If set to false the animation will stop after reaching the last frame
			 * @type {Boolean}
			 * @default true
			 */
			this.looping = owner.anis.looping ?? true;

			/**
			 * Ends the loop on frame 0 instead of the last frame.
			 * This is useful for animations that are symmetric.
			 * For example a walking cycle where the first frame is the
			 * same as the last frame.
			 * @type {Boolean}
			 * @default false
			 */
			this.endOnFirstFrame = owner.anis.endOnFirstFrame ?? false;

			/**
			 * True if frame changed during the last draw cycle
			 * @type {Boolean}
			 */
			this.frameChanged = false;

			this.onComplete = this.onChange = null;
			this._onComplete = this._onChange = null;

			this.rotation = owner.anis.rotation ?? 0;
			this._scale = new Scale();

			if (args.length == 0 || typeof args[0] == 'number') return;

			owner.animations[this.name] = this;
			owner._ani = this;

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

				let extIndex = from.lastIndexOf('.');
				let digits1 = 0;
				let digits2 = 0;

				// start from ext "."
				// work backwards to find where the numbers end
				for (let i = extIndex - 1; i >= 0; i--) {
					if (!isNaN(from.charAt(i))) digits1++;
					else break;
				}

				if (to) {
					for (let i = to.length - 5; i >= 0; i--) {
						if (!isNaN(to.charAt(i))) digits2++;
						else break;
					}
				}

				let ext = from.slice(extIndex);
				let prefix1 = from.slice(0, extIndex - digits1);
				let prefix2;
				if (to) prefix2 = to.slice(0, extIndex - digits2);

				// images don't belong to the same sequence
				// they are just two separate images with numbers
				if (to && prefix1 != prefix2) {
					this.push($.loadImage(from));
					this.push($.loadImage(to));
				} else {
					let num1 = parseInt(from.slice(extIndex - digits1, extIndex), 10);
					num2 ??= parseInt(to.slice(extIndex - digits2, extIndex), 10);

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
							fileName = prefix1 + $.nf(i, digits1) + ext;
							this.push($.loadImage(fileName));
						}
					} // case: case img1, img2
					else {
						for (let i = num1; i <= num2; i++) {
							// Use nf() to number format 'i' into four digits
							fileName = prefix1 + i + ext;
							this.push($.loadImage(fileName));
						}
					}
				}
			} // end sequence mode

			// spriteSheet mode
			else if (typeof args.at(-1) != 'string' && !(args.at(-1) instanceof p5.Image)) {
				let sheet = owner.spriteSheet;
				let atlas;
				if (args[0] instanceof p5.Image || typeof args[0] == 'string') {
					if (args.length >= 3) {
						throw new FriendlyError('Ani', 1);
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
					$._incrementPreload();
					this.spriteSheet = $.loadImage(url, () => {
						_generateSheetFrames();
						$._decrementPreload();
					});
					if (typeof sheet == 'string') {
						owner.spriteSheet = this.spriteSheet;
					}
				}

				function _generateSheetFrames() {
					if (Array.isArray(atlas)) {
						if (typeof atlas[0] == 'object') {
							atlas = { frames: atlas };
						} else if (atlas.length == 4) {
							atlas = { pos: atlas.slice(0, 2), size: atlas.slice(2) };
						} else {
							atlas = { pos: atlas };
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
					if (frames && Array.isArray(frames)) {
						frameCount = frames.length;
					} else frameCount ??= frames || 1;
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
						// sprites will be given default dimensions, but groups
						// are not, _dimensionsUndef is only for sprites
						if (!owner._dimensionsUndef && owner.w && owner.h) {
							w ??= owner.w * tileSize;
							h ??= owner.h * tileSize;
						} else if (tileSize != 1) {
							w ??= tileSize;
							h ??= tileSize;
						} else if (frameCount) {
							w ??= _this.spriteSheet.width / frameCount;
							h ??= _this.spriteSheet.height;
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

					// add all the frames in the animation to the frames array
					if (!Array.isArray(frames)) {
						if (tileSize != 1 || pos || line !== undefined || row !== undefined || col !== undefined) {
							x *= w;
							y *= h;
						}
						for (let i = 0; i < frameCount; i++) {
							let f = { x, y, w, h };
							if ($._defaultImageScale) {
								f.defaultWidth = w * $._defaultImageScale;
								f.defaultHeight = h * $._defaultImageScale;
							}
							_this.push(f);
							x += w;
							if (x >= _this.spriteSheet.width) {
								x = 0;
								y += h;
								if (y >= _this.spriteSheet.height) y = 0;
							}
						}
					} else {
						let sw = Math.round(_this.spriteSheet.width / w);
						for (let frame of frames) {
							let f;
							if (typeof frame == 'number') {
								y = Math.floor(frame / sw) * h;
								x = (frame % sw) * w;
								f = { x, y, w, h };
							} else {
								if (frame.length == 2) {
									x = frame[0] * w;
									y = frame[1] * h;
									f = { x, y, w, h };
								} else {
									f = {
										x: frame[0],
										y: frame[1],
										w: frame[2],
										h: frame[3]
									};
								}
							}
							if ($._defaultImageScale) {
								f.defaultWidth = f.w * $._defaultImageScale;
								f.defaultHeight = f.h * $._defaultImageScale;
							}
							_this.push(f);
						}
					}
				}
			} // end SpriteSheet mode
			else {
				// list of images
				for (let i = 0; i < args.length; i++) {
					if (args[i] instanceof p5.Image) this.push(args[i]);
					else this.push($.loadImage(args[i]));
				}
			}
			// single frame animations don't need to play
			if (this.length == 1) this.playing = false;
		}

		/**
		 * The index of the current frame that the animation is on.
		 * @type {Number}
		 */
		get frame() {
			return this._frame;
		}
		set frame(val) {
			if (val < 0 || val >= this.length) {
				throw new FriendlyError('Ani.frame', [val, this.length]);
			}
			this._frame = val;
			this._cycles = 0;
		}

		/**
		 * Delay between frames in number of draw cycles.
		 * If set to 4 the framerate of the animation would be the
		 * sketch framerate divided by 4 (60fps = 15fps)
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
		/*
		 * TODO frameChange
		 * Set the animation's frame delay in seconds.
		 */
		// get frameChange() {

		// }
		// set frameChange(val) {

		// }

		/**
		 * The animation's scale.
		 *
		 * Can be set to a number to scale both x and y
		 * or an object with x and/or y properties.
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
		 * @return {Ani} A copy of the animation.
		 */
		clone() {
			if (!this.length) {
				console.error(
					`The animation named "${this.name}" must be loaded before it can be properly copied. Sprites need their own copy of a group's animation. Try loading the animation in the preload function and creating new group sprites in the setup function.`
				);
			}
			let ani = new $.Ani();
			ani.spriteSheet = this.spriteSheet;
			for (let i = 0; i < this.length; i++) {
				ani.push(this[i]);
			}
			ani.name = this.name;
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
		 * @param {Number} x - horizontal position
		 * @param {Number} y - vertical position
		 * @param {Number} [r] - rotation
		 * @param {Number} [sx] - scale x
		 * @param {Number} [sy] - scale y
		 */
		draw(x, y, r, sx, sy) {
			this.x = x || 0;
			this.y = y || 0;
			r ??= this.rotation;

			if (!this.visible) return;

			sx ??= 1;
			sy ??= 1;

			$.push();
			$.imageMode('center');

			$.translate(this.x, this.y);
			$.rotate(r);
			$.scale(sx * this._scale._x, sy * this._scale._y);

			let ox = this.offset.x;
			let oy = this.offset.y;

			let img = this[this._frame];
			if (img !== undefined) {
				if (this.spriteSheet) {
					let { x, y, w, h } = img; // image info
					if (!this.demoMode) {
						$.image(this.spriteSheet, ox, oy, img.defaultWidth || w, img.defaultHeight || h, x, y, w, h);
					} else {
						$.image(
							this.spriteSheet,
							ox,
							oy,
							this.spriteSheet.w,
							this.spriteSheet.h,
							x - this.spriteSheet.w / 2 + w / 2,
							y - this.spriteSheet.h / 2 + h / 2
						);
					}
				} else {
					$.image(img, ox, oy);
				}
			} else {
				console.warn(
					'p5play: "' +
						this.name +
						'"' +
						' animation not loaded yet or frame ' +
						this._frame +
						' does not exist. Load this animation in the preload function if you need to use it at the start of your program.'
				);
			}

			$.pop();
		}

		update() {
			if (!this.playing) return;

			this._cycles++;

			if (this._cycles % this.frameDelay == 0) {
				this._cycles = 0;
				this.frameChanged = true;

				if ((this.targetFrame == -1 && this._frame == this.lastFrame) || this._frame == this.targetFrame) {
					if (this.endOnFirstFrame) this._frame = 0;
					if (this.looping) this.targetFrame = -1;
					else this.playing = false;
					if (this._onComplete) this._onComplete();
					if (this.onComplete) this.onComplete(); //fire when on last frame
					if (!this.looping) return;
				}

				//going to target frame up
				if (this.targetFrame > this._frame && this.targetFrame !== -1) {
					this._frame++;
				}
				//going to target frame down
				else if (this.targetFrame < this._frame && this.targetFrame !== -1) {
					this._frame--;
				} else if (this.targetFrame === this._frame && this.targetFrame !== -1) {
					this.playing = false;
				} else if (this.looping) {
					//advance frame
					//if next frame is too high
					if (this._frame >= this.lastFrame) {
						this._frame = 0;
					} else this._frame++;
				} else {
					//if next frame is too high
					if (this._frame < this.lastFrame) this._frame++;
				}
			} else {
				this.frameChanged = false;
			}
		}

		/**
		 * Plays the animation, starting from the specified frame.
		 *
		 * @returns [Promise] a promise that resolves when the animation completes
		 */
		play(frame) {
			this.playing = true;
			if (frame !== undefined && this._frame != frame) {
				this._frame = frame;
				this._cycles = 0;
			}
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
		 */
		pause(frame) {
			this.playing = false;
			if (frame) this._frame = frame;
		}

		/**
		 * Stops the animation. Alt for pause.
		 */
		stop(frame) {
			this.playing = false;
			if (frame) this._frame = frame;
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
		 */
		loop() {
			this.looping = true;
			this.playing = true;
		}

		/**
		 * Prevents the animation from looping
		 */
		noLoop() {
			this.looping = false;
		}

		/**
		 * Goes to the next frame and stops.
		 */
		nextFrame() {
			if (this._frame < this.length - 1) this._frame = this._frame + 1;
			else if (this.looping) this._frame = 0;

			this.targetFrame = -1;
			this.playing = false;
			this._cycles = 0;
		}

		/**
		 * Goes to the previous frame and stops.
		 */
		previousFrame() {
			if (this._frame > 0) this._frame = this._frame - 1;
			else if (this.looping) this._frame = this.length - 1;

			this.targetFrame = -1;
			this.playing = false;
			this._cycles = 0;
		}

		/**
		 * Plays the animation forward or backward toward a target frame.
		 *
		 * @param {Number} toFrame - Frame number destination (starts from 0)
		 * @returns [Promise] a promise that resolves when the animation completes
		 */
		goToFrame(toFrame) {
			if (toFrame < 0 || toFrame >= this.length) {
				return;
			}

			// targetFrame gets used by the update() method to decide what frame to
			// select next.  When it's not being used it gets set to -1.
			this.targetFrame = toFrame;
			this._cycles = 0;

			if (this.targetFrame !== this._frame) {
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
		 * The index of the last frame. Read only.
		 * @type {Number}
		 */
		get lastFrame() {
			return this.length - 1;
		}

		/**
		 * The current frame as an Image object. Read only.
		 * @type {Image}
		 */
		get frameImage() {
			let f = this._frame;
			let img = this[f];
			if (img instanceof p5.Image) return img;

			let { x, y, w, h } = img; // image info

			let image = $.createImage(w, h);
			image.copy(this.spriteSheet, this.offset.x, this.offset.y, w, h, x, y, w, h);
			return image;
		}

		/**
		 * Width of the animation's current frame.
		 * @type {Number}
		 */
		get w() {
			return this.width;
		}
		/**
		 * Width of the animation's current frame.
		 * @type {Number}
		 */
		get width() {
			let frameInfo = this[this._frame];
			if (frameInfo instanceof p5.Image) return frameInfo.width;
			else if (frameInfo) return frameInfo.w;
			return 1;
		}
		get defaultWidth() {
			return this[this._frame].defaultWidth;
		}

		/**
		 * Height of the animation's current frame.
		 * @type {Number}
		 */
		get h() {
			return this.height;
		}
		/**
		 * Height of the animation's current frame.
		 * @type {Number}
		 */
		get height() {
			let frameInfo = this[this._frame];
			if (frameInfo instanceof p5.Image) return frameInfo.height;
			else if (frameInfo) return frameInfo.h;
			return 1;
		}
		get defaultHeight() {
			return this[this._frame].defaultHeight;
		}
	};

	$.Ani.props = ['demoMode', 'endOnFirstFrame', 'frameDelay', 'frameSize', 'looping', 'offset', 'rotation', 'scale'];

	/**
	 * <a href="https://p5play.org/learn/animation.html">
	 * Look at the Animation reference pages before reading these docs.
	 * </a>
	 *
	 * This Anis class serves the same role that Group does for Sprites.
	 * This class is used internally to create `sprite.anis`
	 * and `group.anis`.
	 *
	 * In instances of this class, the keys are animation names,
	 * values are Ani objects.
	 *
	 * Because users only expect instances of this class to contain
	 * animation names as keys, it uses an internal private object
	 * `#_` to store animation properties. Getters and setters are used to
	 * access the private properties, enabling dynamic inheritance.
	 *
	 * @class
	 */
	this.Anis = class {
		#_ = {};
		constructor() {
			let _this = this;

			let props = [...$.Ani.props, 'w', 'h'];
			let vecProps = ['offset', 'scale'];

			for (let prop of props) {
				Object.defineProperty(this, prop, {
					get() {
						return _this.#_[prop];
					},
					set(val) {
						_this.#_[prop] = val;

						// change the prop in all the sprites of this group
						for (let k in _this) {
							let x = _this[k];
							if (!(x instanceof Ani)) continue;
							x[prop] = val;
						}
					}
				});
			}

			for (let vecProp of vecProps) {
				this.#_[vecProp] = {
					_x: 0,
					_y: 0
				};
				for (let prop of ['x', 'y']) {
					Object.defineProperty(this.#_[vecProp], prop, {
						get() {
							return _this.#_[vecProp]['_' + prop];
						},
						set(val) {
							_this.#_[vecProp]['_' + prop] = val;

							for (let k in _this) {
								let x = _this[k];
								if (!(x instanceof Ani)) continue;
								x[vecProp][prop] = val;
							}
						}
					});
				}
			}
		}

		get width() {
			return this.w;
		}
		set width(val) {
			this.w = val;
		}
		get height() {
			return this.h;
		}
		set height(val) {
			this.h = val;
		}
	};

	/**
	 * @class
	 * @extends Array<Sprite>
	 */
	this.Group = class extends Array {
		/**
		 * <a href="https://p5play.org/learn/group.html">
		 * Look at the Group reference pages before reading these docs.
		 * </a>
		 *
		 * A Group is an array of sprites with similar traits and behaviors.
		 *
		 * Group extends Array, so you can use them in for of loops. They
		 * inherit all the functions and properties of standard arrays
		 * such as `group.length` and functions like `group.includes()`.
		 *
		 * Changing a group setting changes it for all the sprites in the
		 * group, similar to class inheritance. Groups can have subgroups,
		 * creating a hierarchy of inheritance.
		 *
		 * The top level group is a q5 instance level variable named
		 * `allSprites` that contains all the sprites added to the sketch.
		 */
		constructor(...args) {
			let parent;
			if (args[0] instanceof $.Group) {
				parent = args[0];
				args = args.slice(1);
			}
			super(...args);

			if (typeof args[0] == 'number') return;
			for (let s of this) {
				if (!(s instanceof $.Sprite)) {
					throw new Error('A group can only contain sprites');
				}
			}

			this._isGroup = true;

			/**
			 * @type {Number}
			 */
			this.x;
			/**
			 * @type {Number}
			 */
			this.y;
			/**
			 * @type {Number}
			 */
			this.vel;
			/**
			 * @type {Number}
			 */
			this.rotation;
			/**
			 * @type {Number}
			 */
			this.rotationSpeed;
			/**
			 * @type {Boolean}
			 */
			this.autoDraw;
			/**
			 * @type {Boolean}
			 */
			this.allowSleeping;
			/**
			 * @type {Number}
			 */
			this.autoUpdate;
			/**
			 * @type {Number}
			 */
			this.bounciness;
			/**
			 * @type {Number}
			 */
			this.collider;
			/**
			 * @type {Number}
			 */
			this.color;
			/**
			 * @type {Boolean}
			 */
			this.debug;
			/**
			 * @type {Number}
			 */
			this.density;
			/**
			 * @type {Number}
			 */
			this.direction;
			/**
			 * @type {Number}
			 */
			this.drag;
			/**
			 * @type {Number}
			 */
			this.friction;
			/**
			 * @type {Number}
			 */
			this.h;
			/**
			 * @type {Boolean}
			 */
			this.isSuperFast;
			/**
			 * @type {Number}
			 */
			this.layer;
			/**
			 * @type {Number}
			 */
			this.life;
			/**
			 * @type {Number}
			 */
			this.mass;
			/**
			 * @type {Object}
			 */
			this.mirror;
			/**
			 * @type {Vector}
			 */
			this.offset;
			/**
			 * @type {Boolean}
			 */
			this.pixelPerfect;
			/**
			 * @type {Boolean}
			 */
			this.removed;
			/**
			 * @type {Number}
			 */
			this.rotationDrag;
			/**
			 * @type {Boolean}
			 */
			this.rotationLock;
			/**
			 * @type {Vector}
			 */
			this.scale;
			/**
			 * @type {Number}
			 */
			this.shape;
			/**
			 * @type {Boolean}
			 */
			this.sleeping;
			/**
			 * @type {Color}
			 */
			this.stroke;
			/**
			 * @type {Number}
			 */
			this.strokeWeight;
			/**
			 * @type {Number}
			 */
			this.text;
			/**
			 * @type {Color}
			 */
			this.textColor;
			/**
			 * @type {String}
			 */
			this.tile;
			/**
			 * @type {Number}
			 */
			this.tileSize;
			/**
			 * @type {Boolean}
			 */
			this.visible;
			/**
			 * @type {Number}
			 */
			this.w;
			/**
			 * @type {Number}
			 */
			this.bearing;
			/**
			 * @type {Number}
			 */
			this.d;
			/**
			 * @type {Boolean}
			 */
			this.dynamic;
			/**
			 * @type {String}
			 */
			this.heading;
			/**
			 * @type {Boolean}
			 */
			this.kinematic;
			/**
			 * @type {Boolean}
			 */
			this.resetAnimationsOnChange;
			/**
			 * @type {Number}
			 */
			this.speed;
			/**
			 * @type {Boolean}
			 */
			this.static;

			/**
			 * Each group has a unique id number. Don't change it!
			 * Its useful for debugging.
			 * @type {Number}
			 */
			this.idNum;

			if ($.p5play.groupsCreated < 999) {
				this.idNum = $.p5play.groupsCreated;
			} else {
				// find the first empty slot in the groups array
				for (let i = 1; i < $.p5play.groups.length; i++) {
					if (!$.p5play.groups[i]?.removed) {
						this.idNum = i;
						break;
					}
				}
				if (!this.idNum) {
					console.warn(
						'ERROR: Surpassed the limit of 999 groups in memory. Try setting `p5play.storeRemovedGroupRefs = false`. Use less groups or delete groups from the p5play.groups array to recycle ids.'
					);
					// if there are no empty slots, try to prevent a crash by
					// finding the first slot that has a group with no sprites in it
					for (let i = 1; i < $.p5play.groups.length; i++) {
						if (!$.p5play.groups[i]?.length) {
							this.idNum = i;
							break;
						}
					}
					this.idNum ??= 1;
				}
			}

			this._uid = this.idNum;
			$.p5play.groups[this._uid] = this;
			$.p5play.groupsCreated++;

			// if the allSprites group doesn't exist yet,
			// this group must be the allSprites group!
			if (!$.allSprites) this._isAllSpritesGroup = true;

			/**
			 * Groups can have subgroups, which inherit the properties
			 * of their parent groups.
			 * @type {Group[]}
			 * @default []
			 */
			this.subgroups = [];

			/**
			 * The parent group's uid number.
			 * @type {Number}
			 * @default undefined
			 */
			if (parent instanceof $.Group) {
				parent.subgroups.push(this);
				let p = parent;
				do {
					p = $.p5play.groups[p.parent];
					p.subgroups.push(this);
				} while (!p._isAllSpritesGroup);
				this.parent = parent._uid;
			} else if (!this._isAllSpritesGroup) {
				$.allSprites.subgroups.push(this);
				this.parent = 0;
			}

			/**
			 * Keys are the animation label, values are Ani objects.
			 * @type {Anis}
			 */
			this.animations = new $.Anis();

			this._hasOverlap = {};
			this._collisions = {};
			this._overlappers = {};

			let _this = this;

			this.Sprite = class extends $.Sprite {
				constructor() {
					super(_this, ...arguments);
				}
			};
			/**
			 * @class
			 */
			this.GroupSprite = this.Sprite;

			// JSDoc breaks if I don't put @class for GroupSprite
			// but for typescript defs they should be typeof Sprite
			// and get replaced as such by the p5play-types build.js script

			this.Group = class extends $.Group {
				constructor() {
					super(_this, ...arguments);
				}
			};
			/**
			 * @class
			 */
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

			for (let prop of $.Sprite.propsAll) {
				if (prop == 'ani' || prop == 'velocity' || prop == 'width' || prop == 'height' || prop == 'diameter') continue;

				Object.defineProperty(this, prop, {
					get() {
						let val = _this['_' + prop];
						if (val === undefined && !_this._isAllSpritesGroup) {
							let parent = $.p5play.groups[_this.parent];
							if (parent) {
								val = parent[prop];
							}
						}
						return val;
					},
					set(val) {
						_this['_' + prop] = val;

						// propagate the change to all of this group's subgroups
						for (let g of _this.subgroups) {
							g['_' + prop] = val;
						}

						// change the prop in all the sprites in this group
						for (let i = 0; i < _this.length; i++) {
							let s = _this[i];
							let v = val;
							if (typeof val == 'function') v = val(i);
							s[prop] = v;
						}
					}
				});
			}

			let vecProps = ['mirror', 'offset', 'scale', 'vel'];
			for (let vecProp of vecProps) {
				vecProp = '_' + vecProp;
				if (vecProp != 'vel') this[vecProp] = {};
				else this[vecProp] = new $.Vector();
				this[vecProp]._x = 0;
				this[vecProp]._y = 0;
				for (let prop of ['x', 'y']) {
					Object.defineProperty(this[vecProp], prop, {
						get() {
							let val = _this[vecProp]['_' + prop];
							let i = _this.length - 1;
							if (val === undefined && !_this._isAllSpritesGroup) {
								let parent = $.p5play.groups[_this.parent];
								if (parent) {
									val = parent[vecProp][prop];
									i = parent.length - 1;
								}
							}
							return val;
						},
						set(val) {
							_this[vecProp]['_' + prop] = val;

							// change the prop in all the sprite of this group
							for (let i = 0; i < _this.length; i++) {
								let s = _this[i];
								let v = val;
								if (typeof val == 'function') v = val(i);
								s[vecProp][prop] = v;
							}
						}
					});
				}
			}

			if (this._isAllSpritesGroup) {
				/**
				 * autoCull is a property of the allSprites group only,
				 * that controls whether sprites are automatically removed
				 * when they are 10,000 pixels away from the camera.
				 *
				 * It only needs to be set to false once and then it will
				 * remain false for the rest of the sketch, unless changed.
				 * @type {Boolean}
				 */
				this.autoCull = true;
				this.tileSize = 1;
				this.autoDraw = true;
				this.autoUpdate = true;
			}

			/**
			 * Alias for `push`.
			 *
			 * Adds a sprite to the end of the group.
			 */
			this.add = this.push;

			/**
			 * Alias for group.includes
			 *
			 * Check if a sprite is in the group.
			 */
			this.contains = this.includes;
		}

		/*
		 * Returns the highest layer in a group
		 */
		_getTopLayer() {
			if (this.length == 0) return 0;
			if (this.length == 1 && this[0]._layer === undefined) return 0;
			let max = this[0]._layer;
			for (let s of this) {
				if (s._layer > max) max = s._layer;
			}
			return max;
		}

		/**
		 * Reference to the group's current animation.
		 * @type {Ani}
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
		 * @type {Ani}
		 */
		get animation() {
			return this._ani;
		}
		set animation(val) {
			this.ani = val;
		}

		/**
		 * The group's animations.
		 * @type {Anis}
		 */
		get anis() {
			return this.animations;
		}
		/**
		 * Alias for `group.image`.
		 * @type {Image}
		 */
		get img() {
			return this._img;
		}
		set img(val) {
			this.image = val;
		}
		/**
		 * The group's image.
		 * @type {Image}
		 */
		get image() {
			return this._img;
		}
		set image(img) {
			if (typeof img == 'function') {
				this._img = img;
				return;
			}
			if (typeof img == 'string') {
				if (!img.includes('.')) {
					img = new $.EmojiImage(img, this.w || this.width || this.d || this.diameter);
				} else img = $.loadImage(img);
			}
			this._img = $.Sprite.prototype._extendImage(img);
		}

		/**
		 * Depending on the value that the amount property is set to, the group will
		 * either add or remove sprites.
		 * @type {Number}
		 */
		get amount() {
			return this.length;
		}
		set amount(val) {
			let diff = val - this.length;
			let shouldAdd = diff > 0;
			diff = Math.abs(diff);
			for (let i = 0; i < diff; i++) {
				if (shouldAdd) new this.Sprite();
				else this[this.length - 1].remove();
			}
		}

		/**
		 * @type {Number}
		 */
		get diameter() {
			return this.d;
		}
		set diameter(val) {
			this.d = val;
		}
		/**
		 * @type {Number}
		 */
		get width() {
			return this.w;
		}
		set width(val) {
			this.w = val;
		}
		/**
		 * @type {Number}
		 */
		get height() {
			return this.h;
		}
		set height(val) {
			this.h = val;
		}

		/**
		 * The sprite's velocity vector {x, y}
		 * @type {Vector}
		 * @default {x: 0, y: 0}
		 */
		get velocity() {
			return this.vel;
		}
		set velocity(val) {
			this.vel = val;
		}

		_resetCentroid() {
			let x = 0;
			let y = 0;
			for (let s of this) {
				x += s.x;
				y += s.y;
			}
			this.centroid = { x: x / this.length, y: y / this.length };
			return this.centroid;
		}

		_resetDistancesFromCentroid() {
			for (let s of this) {
				s.distCentroid = {
					x: s.x - this.centroid.x,
					y: s.y - this.centroid.y
				};
			}
		}

		_validateCollideParams(target, cb) {
			if (cb && typeof cb != 'function') {
				throw new FriendlyError('Group.collide', 1, [cb]);
			}
			if (!target) {
				throw new FriendlyError('Group.collide', 2);
			}
			if (!target._isGroup && !target._isSprite) {
				throw new FriendlyError('Group.collide', 0, [target]);
			}
		}

		_setContactCB(target, cb, contactType, eventType) {
			if (target._isSprite) {
				let reversedCB = function (a, b, v) {
					return cb.call(b, b, a, v);
				};
				target._setContactCB(this, reversedCB, contactType, eventType);
				return;
			}

			let type;
			if (contactType == 0) type = eventTypes._collisions[eventType];
			else type = eventTypes._overlappers[eventType];

			let ledger = $.p5play[type];

			let l = (ledger[this._uid] ??= {});

			if (l[target._uid] == cb) return;
			l[target._uid] = cb;
			for (let s of this) {
				let c2 = (ledger[s._uid] ??= {});
				c2[target._uid] = cb;
			}

			if (this._uid == target._uid) return;

			l = ledger[target._uid];
			if (!l || !l[this._uid]) return;
			if (this._uid != target._uid) delete l[this._uid];
			for (let s of target) {
				l = ledger[s._uid];
				if (!l || !l[this._uid]) continue;
				delete l[this._uid];
				if (Object.keys(l).length == 0) {
					delete ledger[s._uid];
				}
			}
			if (Object.keys(l).length == 0) {
				delete ledger[target._uid];
			}
		}

		_ensureCollide(target) {
			if (this._hasOverlap[target._uid] !== false) {
				this._hasOverlap[target._uid] = false;
				for (let s of this) {
					s._hasOverlap[target._uid] = false;
					target._hasOverlap[s._uid] = false;
					// if this group is the same group as the target
					if (this._uid == target._uid) {
						for (let s2 of target) {
							s._hasOverlap[s2._uid] = false;
							s2._hasOverlap[s._uid] = false;
						}
					}
				}
			}
			if (target._hasOverlap[this._uid] !== false) {
				target._hasOverlap[this._uid] = false;
				if (target._isGroup) {
					for (let s of target) {
						s._hasOverlap[this._uid] = false;
						this._hasOverlap[s._uid] = false;
						for (let s2 of this) {
							s._hasOverlap[s2._uid] = false;
							s2._hasOverlap[s._uid] = false;
						}
					}
				}
			}
		}

		collide(target, callback) {
			return this.collides(target, callback);
		}

		/**
		 * Returns true on the first frame that the group collides with the
		 * target group.
		 *
		 * Custom collision event handling can be done by using this function
		 * in an if statement or adding a callback as the second parameter.
		 *
		 * @param {Group} target
		 * @param {Function} [callback]
		 */
		collides(target, callback) {
			this._validateCollideParams(target, callback);
			this._ensureCollide(target);
			if (callback) this._setContactCB(target, callback, 0, 0);
			return this._collisions[target._uid] == 1 || this._collisions[target._uid] <= -3;
		}

		/**
		 * Returns the amount of frames that the group has been colliding
		 * with the target group for, which is a truthy value. Returns 0 if
		 * the group is not colliding with the target group.
		 *
		 * @param {Group} target
		 * @param {Function} [callback]
		 * @return {Number} frames
		 */
		colliding(target, callback) {
			this._validateCollideParams(target, callback);
			this._ensureCollide(target);
			if (callback) this._setContactCB(target, callback, 0, 1);
			let val = this._collisions[target._uid];
			if (val <= -3) return 1;
			return val > 0 ? val : 0;
		}

		/**
		 * Returns true on the first frame that the group no longer overlaps
		 * with the target group.
		 *
		 * @param {Group} target
		 * @param {Function} [callback]
		 * @return {Boolean}
		 */
		collided(target, callback) {
			this._validateCollideParams(target, callback);
			this._ensureCollide(target);
			if (callback) this._setContactCB(target, callback, 0, 2);
			return this._collisions[target._uid] <= -1;
		}

		_validateOverlapParams(target, cb) {
			if (cb && typeof cb != 'function') {
				throw new FriendlyError('Group.overlap', 1, [cb]);
			}
			if (!target) {
				throw new FriendlyError('Group.overlap', 2);
			}
			if (!target._isGroup && !target._isSprite) {
				throw new FriendlyError('Group.overlap', 0, [target]);
			}
		}

		_ensureOverlap(target) {
			if (!this._hasSensors) {
				for (let s of this) {
					if (!s._hasSensors) s.addDefaultSensors();
				}
				this._hasSensors = true;
			}
			if (!target._hasSensors) {
				if (target._isSprite) {
					target.addDefaultSensors();
				} else {
					for (let s of target) {
						if (!s._hasSensors) s.addDefaultSensors();
					}
					target._hasSensors = true;
				}
			}
			if (this._hasOverlap[target._uid] != true) {
				this._removeContactsWith(target);
				this._hasOverlap[target._uid] = true;
				for (let s of this) {
					s._hasOverlap[target._uid] = true;
					target._hasOverlap[s._uid] = true;
					// if this group is the same group as the target
					if (this._uid == target._uid) {
						for (let s2 of target) {
							s._hasOverlap[s2._uid] = true;
							s2._hasOverlap[s._uid] = true;
						}
					}
				}
			}
			if (target._hasOverlap[this._uid] != true) {
				target._removeContactsWith(this);
				target._hasOverlap[this._uid] = true;
				if (target._isGroup) {
					for (let s of target) {
						s._hasOverlap[this._uid] = true;
						this._hasOverlap[s._uid] = true;
						for (let s2 of this) {
							s._hasOverlap[s2._uid] = true;
							s2._hasOverlap[s._uid] = true;
						}
					}
				}
			}
		}

		overlap(target, callback) {
			return this.overlaps(target, callback);
		}

		/**
		 * Returns true on the first frame that the group overlaps with the
		 * target group.
		 *
		 * Custom overlap event handling can be done by using this function
		 * in an if statement or adding a callback as the second parameter.
		 *
		 * @param {Group} target
		 * @param {Function} [callback]
		 */
		overlaps(target, callback) {
			this._validateOverlapParams(target, callback);
			this._ensureOverlap(target);
			if (callback) this._setContactCB(target, callback, 1, 0);
			return this._overlappers[target._uid] == 1 || this._overlappers[target._uid] <= -3;
		}

		/**
		 * Returns the amount of frames that the group has been overlapping
		 * with the target group for, which is a truthy value. Returns 0 if
		 * the group is not overlapping with the target group.
		 *
		 * @param {Group} target
		 * @param {Function} [callback]
		 * @return {Number} frames
		 */
		overlapping(target, callback) {
			this._validateOverlapParams(target, callback);
			this._ensureOverlap(target);
			if (callback) this._setContactCB(target, callback, 1, 1);
			let val = this._overlappers[target._uid];
			if (val <= -3) return 1;
			return val > 0 ? val : 0;
		}

		/**
		 * Returns true on the first frame that the group no longer overlaps
		 * with the target group.
		 *
		 * @param {Group} target
		 * @param {Function} [callback]
		 * @return {Boolean}
		 */
		overlapped(target, callback) {
			this._validateOverlapParams(target, callback);
			this._ensureOverlap(target);
			if (callback) this._setContactCB(target, callback, 1, 2);
			return this._overlappers[target._uid] <= -1;
		}

		_removeContactsWith(o) {
			for (let s of this) {
				s._removeContactsWith(o);
			}
		}

		/**
		 */
		applyForce() {
			for (let s of this) {
				s.applyForce(...arguments);
			}
		}

		/**
		 */
		applyForceScaled() {
			for (let s of this) {
				s.applyForceScaled(...arguments);
			}
		}

		/**
		 */
		attractTo() {
			for (let s of this) {
				s.attractTo(...arguments);
			}
		}

		/**
		 */
		applyTorque() {
			for (let s of this) {
				s.applyTorque(...arguments);
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
				if (obj == $.mouse && !$.mouse.isActive) return;
				speed = y;
				y = obj.y;
				x = obj.x;
			}
			let centroid = this._resetCentroid();
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
				if (obj == $.mouse && !$.mouse.isActive) return;
				tracking = y;
				y = obj.y;
				x = obj.x;
			}
			if (x === undefined && y === undefined) return;
			this._resetCentroid();
			for (let s of this) {
				if (s.distCentroid === undefined) this._resetDistancesFromCentroid();
				let dest = {
					x: s.distCentroid.x + x,
					y: s.distCentroid.y + y
				};
				s.moveTowards(dest.x, dest.y, tracking);
			}
		}

		/**
		 */
		moveAway(x, y, repel) {
			if (typeof x != 'number') {
				let obj = x;
				if (obj == $.mouse && !$.mouse.isActive) return;
				repel = y;
				y = obj.y;
				x = obj.x;
			}
			if (x === undefined && y === undefined) return;
			this._resetCentroid();
			for (let s of this) {
				if (s.distCentroid === undefined) this._resetDistancesFromCentroid();
				let dest = {
					x: s.distCentroid.x + x,
					y: s.distCentroid.y + y
				};
				s.moveAway(dest.x, dest.y, repel);
			}
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
		 * @param {...Sprite} sprites - The sprite or sprites to be added
		 * @returns {Number} the new length of the group
		 */
		push(...sprites) {
			if (this.removed) {
				console.warn(
					"Adding a sprite to a group that was removed. Use `group.removeAll()` to remove all of a group's sprites without removing the group itself. Restoring the group in p5play's memory."
				);
				$.p5play.groups[this._uid] = this;
				this.removed = false;
			}
			for (let s of sprites) {
				if (!(s instanceof $.Sprite)) {
					throw new Error('You can only add sprites to a group, not ' + typeof s);
				}
				if (s.removed) {
					console.error("Can't add a removed sprite to a group");
					continue;
				}

				let b;
				for (let tuid in this._hasOverlap) {
					let hasOverlap = this._hasOverlap[tuid];
					if (hasOverlap && !s._hasSensors) {
						s.addDefaultSensors();
					}
					if (tuid >= 1000) b = $.p5play.sprites[tuid];
					else b = $.p5play.groups[tuid];

					if (!b || b.removed) continue;

					if (!hasOverlap) b._ensureCollide(s);
					else b._ensureOverlap(s);
				}
				for (let event in eventTypes) {
					let contactTypes = eventTypes[event];
					for (let contactType of contactTypes) {
						let ledger = $.p5play[contactType];
						let lg = ledger[this._uid];
						if (!lg) continue;

						let ls = (ledger[s._uid] ??= {});
						for (let b_uid in lg) {
							ls[b_uid] = lg[b_uid];
						}
					}
				}

				super.push(s);
				// push to subgroups, excluding allSprites
				// since sprites are automatically added to allSprites
				if (this.parent) $.p5play.groups[this.parent].push(s);

				s.groups.push(this);
			}
			return this.length;
		}

		/**
		 */
		repelFrom() {
			for (let s of this) {
				s.repelFrom(...arguments);
			}
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
		 * relative to the camera. Sprites with chain colliders can not be culled.
		 *
		 * Can also be used with a uniform size for all boundaries, see example.
		 *
		 * @param {Number} top - the distance that sprites can move below the canvas before they are removed
		 * @param {Number} bottom - the distance that sprites can move below the canvas before they are removed
		 * @param {Number} left - the distance that sprites can move beyond the left side of the canvas before they are removed
		 * @param {Number} right - the distance that sprites can move beyond the right side of the canvas before they are removed
		 * @param {Function} [cb] - the function to be run when a sprite is culled,
		 * it's given the sprite being culled, if no callback is given then the
		 * sprite is removed
		 * @return {Number} the number of sprites culled
		 * @example
		 * // alternate uniform size syntax
		 * group.cull(100, callback);
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

			let cx = $.camera.x - $.canvas.hw / $.camera.zoom;
			let cy = $.camera.y - $.canvas.hh / $.camera.zoom;

			let minX = -left + cx;
			let minY = -top + cy;
			let maxX = $.width + right + cx;
			let maxY = $.height + bottom + cy;

			let culled = 0;
			for (let i = 0; i < this.length; i++) {
				let s = this[i];
				if (s.shape == 'chain') continue;
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
		 * If no input is given to this function, the group itself will be
		 * marked as removed and deleted from p5play's internal memory, the
		 * `p5play.groups` array. Every sprite in the group will be removed
		 * from the world and every other group they belong to.
		 *
		 * Groups should not be used after they are removed.
		 *
		 * If this function receives as input an index of a sprite in the
		 * group or the sprite itself, it will remove that sprite from
		 * this group and its super groups (if any), but NOT from the world.
		 *
		 * To remove a sprite from the world and every group it belongs to,
		 * use `sprite.remove()` instead.
		 *
		 * @param {Sprite|Number} item - the sprite to be removed or its index
		 * @return {Sprite} the removed sprite or undefined if the specified sprite was not found
		 */
		remove(item) {
			if (item === undefined) {
				this.removeAll();
				if (!this._isAllSpritesGroup) this.removed = true;
				return;
			}

			let idx;
			if (typeof item == 'number') {
				if (item >= 0) idx = item;
				else idx = this.length + item;
			} else {
				idx = this.indexOf(item);
			}

			if (idx == -1) return;

			let s = this[idx];
			this.splice(idx, 1);
			return s;
		}

		/**
		 * Using `group.remove` instead is recommended because it's easier to use,
		 * and it uses this function internally.
		 *
		 * Similar to `Array.splice` except it does not accept adding sprites,
		 * third parameters and beyond are ignored.
		 *
		 * This function also removes the group and its super-groups from the
		 * sprites' groups array.
		 *
		 * @param {Number} idx - index
		 * @param {Number} amount - number of sprites to remove
		 * @return {Sprite[]} the removed sprites
		 */
		splice(idx, amount) {
			let removed = super.splice(idx, amount);
			if (!removed) return;

			let gIDs = [];
			for (let s of removed) {
				if (s.removed) continue;

				// remove from the removed sprites' group array
				// this group and its super-groups
				let gID = this._uid;
				do {
					gIDs.push(gID);
					let gIdx = s.groups.findIndex((g) => g._uid == gID);
					let g = s.groups.splice(gIdx, 1);
					gID = g[0].parent;
				} while (gID);
			}

			// loop through the groups that the sprite was removed from
			for (let gID of gIDs) {
				let a = $.p5play.groups[gID];
				for (let eventType in eventTypes) {
					// loop through group's contacts with other sprites and groups
					for (let b_uid in a[eventType]) {
						if (a[eventType][b_uid] == 0) continue;
						let b;
						if (b_uid >= 1000) b = $.p5play.sprites[b_uid];
						else b = $.p5play.groups[b_uid];
						// check if any group members are still in contact with the sprite
						let inContact = false;
						for (let s of a) {
							if (s[eventType][b._uid] > 0) {
								inContact = true;
								break;
							}
						}
						// if not, set the contact to the collided or overlapped state
						if (!inContact) {
							a[eventType][b._uid] = -2;
							b[eventType][a._uid] = -2;
						}
					}
				}
			}
			return removed;
		}

		/**
		 * Removes the last sprite in the group.
		 * @return {Sprite} the removed sprite or undefined if the group is empty
		 */
		pop() {
			return this.remove(this.length - 1);
		}

		/**
		 * Removes the last sprite in the group.
		 * @return {Sprite} the removed sprite or undefined if the group is empty
		 */
		shift() {
			return this.remove(0);
		}

		/**
		 * Not supported!
		 * @return {Number} the new length of the group
		 */
		unshift() {
			console.error('unshift is not supported for groups');
			return this.length;
		}

		/**
		 * Removes all the sprites in the group from the world and
		 * every other group they belong to.
		 *
		 * Does not delete the group itself.
		 */
		removeAll() {
			while (this.length > 0) {
				this.at(-1).remove();
			}
		}

		_step() {
			this.__step();
		}

		/**
		 * Updates all the sprites in the group.
		 */
		update() {
			for (let s of this) {
				if (!$.p5play._inPostDraw || s.autoUpdate) {
					s.update();
				}
			}
			if (this._autoUpdate) this._autoUpdate = null;
		}

		/**
		 * Draws all the sprites in the group in ascending order
		 * by `sprite.layer`.
		 */
		draw() {
			let g = [...this];
			g.sort((a, b) => a._layer - b._layer);
			for (let s of g) {
				if (s._visible !== false && (!$.p5play._inPostDraw || s.autoDraw)) {
					s.draw();
				}
			}
			if (this._autoDraw) this._autoDraw = null;
		}

		/**
		 * Runs every group sprite's post draw function.
		 */
		postDraw() {
			for (let s of this) {
				s.postDraw();
			}
		}
	};

	$.Group.prototype.addAni =
		$.Group.prototype.addAnimation =
		$.Sprite.prototype.addAnimation =
			$.Sprite.prototype.addAni;

	$.Group.prototype.addAnis =
		$.Group.prototype.addAnimations =
		$.Sprite.prototype.addAnimations =
			$.Sprite.prototype.addAnis;

	$.Group.prototype.__step = $.Sprite.prototype.__step;
	$.Group.prototype.___step = $.Sprite.prototype.___step;

	/**
	 * @class
	 * @extends planck.World
	 */
	this.World = class extends planck.World {
		/**
		 * <a href="https://p5play.org/learn/world.html">
		 * Look at the World reference pages before reading these docs.
		 * </a>
		 *
		 * A `world` object is created automatically by p5play. There can only
		 * be one world per sketch (instance of p5 or q5).
		 *
		 * This class extends `planck.World` and adds some p5play specific
		 * features.
		 */
		constructor() {
			super(new pl.Vec2(0, 0), true);

			this.mod = {};

			/**
			 * Changes the world's origin point,
			 * where (0, 0) is on the canvas.
			 * @type {Object}
			 * @property {Number} x
			 * @property {Number} y
			 * @default { x: 0, y: 0 }
			 */
			this.origin = { x: 0, y: 0 };

			this.contacts = [];
			this.on('begin-contact', this._beginContact);
			this.on('end-contact', this._endContact);

			let _this = this;
			this._gravity = {
				get x() {
					return _this.m_gravity.x;
				},
				set x(val) {
					val = Math.round(val || 0);
					if (val == _this.m_gravity.x) return;
					_this.mod[0] = true;
					for (let s of $.allSprites) {
						s.sleeping = false;
					}
					_this.m_gravity.x = val;
				},
				get y() {
					return _this.m_gravity.y;
				},
				set y(val) {
					val = Math.round(val || 0);
					if (val == _this.m_gravity.y) return;
					_this.mod[0] = true;
					for (let s of $.allSprites) {
						s.sleeping = false;
					}
					_this.m_gravity.y = val;
				}
			};

			this._timeScale = 1;
			this._updateRate = 60;
			this._syncedToFrameRate = true;
			this._lastStepTime = 0;
			this._setTimeStep();

			/**
			 * @type {Number}
			 * @default 8
			 */
			this.velocityIterations = 8;
			/**
			 * @type {Number}
			 * @default 3
			 */
			this.positionIterations = 3;
			/**
			 * @type {Number}
			 * @default 0.19
			 */
			this.velocityThreshold = 0.19;
			/**
			 * The time elapsed in the physics simulation in seconds.
			 * @type {Number}
			 */
			this.physicsTime = 0;
			/**
			 * Represents the size of a meter in pixels.
			 *
			 * Adjusting this property changes the simulated scale of the physics world.
			 * For optimal results, it should be set such that sprites are between
			 * 0.1 and 10 meters in size in the physics simulation.
			 *
			 * The default value is 60, which means that your sprites should optimally
			 * be between 6 and 600 pixels in size.
			 * @type {Number}
			 * @default 60
			 */
			this.meterSize = 60;
			/**
			 * @type {Boolean}
			 * @default true
			 */
			this.mouseTracking ??= true;
			/**
			 * The sprite the mouse is hovering over.
			 *
			 * If the mouse is hovering over several sprites, the mouse
			 * sprite will be the one with the highest layer value.
			 * @type {Sprite}
			 * @default null
			 */
			this.mouseSprite = null;
			/**
			 * The sprite(s) that the mouse is hovering over.
			 * @type {Sprite[]}
			 * @default []
			 */
			this.mouseSprites = [];
			/**
			 * @type {Boolean}
			 * @default true
			 */
			this.autoStep = true;

			this.step = this.physicsUpdate;

			if (window.Event) {
				this.steppedEvent = new window.Event('p5play_worldStepped');
			}
		}

		/**
		 * Gravity force vector that affects all dynamic physics colliders.
		 * @type {Object}
		 * @property {Number} x
		 * @property {Number} y
		 * @default { x: 0, y: 0 }
		 */
		get gravity() {
			return this._gravity;
		}
		set gravity(val) {
			this._gravity.x = val.x;
			this._gravity.y = val.y;
		}

		/**
		 * A time scale of 1.0 represents real time.
		 * Accepts decimal values between 0 and 2.
		 * @type {Number}
		 * @default 1.0
		 */
		get timeScale() {
			return this._timeScale;
		}
		set timeScale(val) {
			if (val < 0 || val > 2) {
				return console.error('world.timeScale must be between 0 and 2');
			}
			if (this._timeScale == val) return;
			this._timeScale = val;
			this._setTimeStep();
		}

		/**
		 * The fixed update rate of the physics simulation in hertz.
		 *
		 * The time step, the amount of time that passes during a
		 * physics update, is calculated to be: 1 / updateRate * timeScale
		 *
		 * Setting the update rate to a value lower than 50hz is not
		 * recommended, as simulation quality will degrade.
		 * @type {Number}
		 * @default 60
		 */
		get updateRate() {
			return this._updateRate;
		}
		set updateRate(val) {
			this._updateRate = val;
			this._syncedToFrameRate = val == $._targetFrameRate;
			this._setTimeStep();
		}

		_setTimeStep() {
			this._timeStep = (1 / this._updateRate) * this._timeScale;
		}

		/**
		 * The lowest velocity an object can have before it is considered
		 * to be at rest.
		 *
		 * Adjust the velocity threshold to allow for slow moving objects
		 * but don't have it be too low, or else objects will never sleep,
		 * which will hurt performance.
		 *
		 * @type {Number}
		 * @default 0.19
		 */
		get velocityThreshold() {
			return pl.Settings.velocityThreshold;
		}
		set velocityThreshold(val) {
			pl.Settings.velocityThreshold = val;
		}

		/**
		 * Performs a physics simulation step that advances all sprites'
		 * forward in time by 1/60th of a second if no timeStep is given.
		 *
		 * This function is automatically called at the end of the draw
		 * loop, unless it was already called inside the draw loop.
		 *
		 * Setting the timeStep below 1/50th of a second will
		 * significantly degrade simulation quality, without improving
		 * performance. Decreasing `velocityIterations` and
		 * `positionIterations` will improve performance but decrease
		 * simulation quality.
		 *
		 * @param {Number} [timeStep] - time step in seconds
		 * @param {Number} [velocityIterations] - 8 by default
		 * @param {Number} [positionIterations] - 3 by default
		 */
		physicsUpdate(timeStep, velocityIterations, positionIterations) {
			usePhysics = true;
			timeScale = this._timeScale;

			for (let s of $.allSprites) {
				s.prevPos.x = s.x;
				s.prevPos.y = s.y;
				s.prevRotation = s.rotation;
			}

			timeStep ??= this._timeStep;

			super.step(
				timeStep,
				velocityIterations || this.velocityIterations,
				positionIterations || this.positionIterations
			);
			this.physicsTime += timeStep;

			let sprites = Object.values($.p5play.sprites);
			let groups = Object.values($.p5play.groups);

			for (let s of sprites) s._step();
			for (let g of groups) g._step();

			for (let s of sprites) s.___step();
			for (let g of groups) g.___step();

			if ($.canvas.dispatchEvent) {
				$.canvas.dispatchEvent(this.steppedEvent);
			}

			if (!this._syncedToFrameRate) {
				for (let s of $.allSprites) s._syncWithPhysicsBody();
			}

			if (this.autoStep) this.autoStep = null;
		}

		/**
		 * Experimental!
		 *
		 * Visually moves all sprites forward in time by the given
		 * time step, based on their current velocity vector and
		 * rotation speed.
		 *
		 * Does not perform any physics calculations.
		 *
		 * This function may be useful for making extrapolated frames
		 * between physics steps, if a frame rate of 100hz or more
		 * is desired.
		 * @param {Number} [timeStep] - time step in seconds
		 */
		extrapolationUpdate(timeStep) {
			timeStep ??= this._timeStep;

			for (let s of $.allSprites) {
				s.prevPos.x = s.x;
				s.prevPos.y = s.y;
				s.prevRotation = s.rotation;
			}

			usePhysics = false;
			timeScale = (timeStep / this._timeStep) * this._timeScale;

			let sprites = Object.values($.p5play.sprites);
			let groups = Object.values($.p5play.groups);

			for (let s of sprites) s._step();
			for (let g of groups) g._step();

			if (this.autoStep) this.autoStep = null;
		}

		/**
		 * The real time in seconds since the world was created, including
		 * time spent paused.
		 * @type {Number}
		 */
		get realTime() {
			return $.millis() / 1000;
		}

		/**
		 * Returns the sprites at a position, ordered by layer.
		 *
		 * Sprites must have a physics body to be detected.
		 * @param {Number} x - x coordinate or position object
		 * @param {Number} y
		 * @param {Group} [group] - limit results to a specific group,
		 * allSprites by default
		 * @param {Boolean} [cameraActiveWhenDrawn] - limit results to
		 * sprites drawn when the camera was active, true by default
		 * @returns {Sprite[]} an array of sprites
		 */
		getSpritesAt(x, y, group, cameraActiveWhenDrawn = true) {
			if (typeof x == 'object') {
				cameraActiveWhenDrawn = group ?? true;
				group = y;
				y = x.y;
				x = x.x;
			}
			const point = new pl.Vec2(x / this.meterSize, y / this.meterSize);
			const aabb = new pl.AABB();
			aabb.lowerBound = new pl.Vec2(point.x - 0.001, point.y - 0.001);
			aabb.upperBound = new pl.Vec2(point.x + 0.001, point.y + 0.001);

			// Query the world for fixture AABBs that overlap the point AABB
			// narrowing down the number of fixtures to check with
			// the more expensive testPoint method
			let fxts = [];
			this.queryAABB(aabb, (fxt) => {
				// we need to make sure the point is actually within the shape
				if (fxt.getShape().testPoint(fxt.getBody().getTransform(), point)) {
					fxts.push(fxt);
				}
				return true;
			});
			if (fxts.length == 0) return [];

			group ??= $.allSprites;
			let sprites = [];
			for (let fxt of fxts) {
				const s = fxt.m_body.sprite;
				if (s._cameraActiveWhenDrawn == cameraActiveWhenDrawn) {
					if (!sprites.find((x) => x._uid == s._uid)) sprites.push(s);
				}
			}
			sprites.sort((a, b) => (a._layer - b._layer) * -1);
			return sprites;
		}

		/**
		 * Returns the sprite at the specified position
		 * on the top most layer, drawn when the camera was on.
		 *
		 * The sprite must have a physics body to be detected.
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Group} [group] - the group to search
		 * @returns {Sprite} a sprite
		 */
		getSpriteAt(x, y, group) {
			const sprites = this.getSpritesAt(x, y, group);
			return sprites[0];
		}

		getMouseSprites() {
			let sprites = this.getSpritesAt($.mouse.x, $.mouse.y);
			if ($.camera._wasOff) {
				let uiSprites = this.getSpritesAt($.mouse.canvasPos.x, $.mouse.canvasPos.y, $.allSprites, false);
				if (uiSprites.length) sprites = [...uiSprites, ...sprites];
			}
			return sprites;
		}

		/*
		 * Sets contact trackers to 0, after the world's super.step()
		 * they will be increased to 1.
		 */
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
					a[t][g._uid] = 0;
					g[t][a._uid] = 0;
				}
			}

			for (let g of a.groups) {
				if (!b[t][g._uid] || b[t][g._uid] < 0) {
					b[t][g._uid] = 0;
					g[t][b._uid] = 0;
				}
				for (let g2 of b.groups) {
					if (!g[t][g2._uid] || g[t][g2._uid] < 0) {
						g[t][g2._uid] = 0;
						g2[t][g._uid] = 0;
					}
				}
			}
		}

		/*
		 * If contact ended between sprites that where previously in contact,
		 * then their contact trackers are set to -2 which will be incremented
		 * to -1 on the next physics update.
		 *
		 * However, if contact begins and ends on the same frame, then the contact
		 * trackers are set to -4 and incremented to -3 on the next physics update.
		 */
		_endContact(contact) {
			let a = contact.m_fixtureA;
			let b = contact.m_fixtureB;
			let contactType = '_collisions';
			if (a.m_isSensor) contactType = '_overlappers';
			a = a.m_body.sprite;
			b = b.m_body.sprite;

			a[contactType][b._uid] = a[contactType][b._uid] != 0 ? -2 : -4;
			b[contactType][a._uid] = b[contactType][a._uid] != 0 ? -2 : -4;

			for (let g of b.groups) {
				let inContact = false;
				for (let s of g) {
					if (s[contactType][a._uid] >= 0) {
						inContact = true;
						break;
					}
				}
				if (!inContact) {
					g[contactType][a._uid] = g[contactType][a._uid] != 0 ? -2 : -4;
					a[contactType][g._uid] = a[contactType][g._uid] != 0 ? -2 : -4;
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
					g[contactType][b._uid] = g[contactType][b._uid] != 0 ? -2 : -4;
					b[contactType][g._uid] = b[contactType][g._uid] != 0 ? -2 : -4;
					for (let g2 of b.groups) {
						g[contactType][g2._uid] = g[contactType][g2._uid] != 0 ? -2 : -4;
						g2[contactType][g._uid] = g2[contactType][g._uid] != 0 ? -2 : -4;
					}
				}
			}
		}

		/*
		 * Used internally to find contact callbacks.
		 *
		 * @param type is the eventType of contact callback to find
		 * @param s0 is the first sprite
		 * @param s1 is the second sprite
		 */
		_findContact(type, s0, s1) {
			let cb = s0[type][s1._uid];
			if (cb) return cb;

			for (let g1 of s1.groups) {
				cb = s0[type][g1._uid];
				if (cb) return cb;
			}

			for (let g0 of s0.groups) {
				cb = g0[type][s1._uid];
				if (cb) return cb;

				for (let g1 of s1.groups) {
					if (g0._uid != g1._uid) continue;
					cb = g0[type][g1._uid];
					if (cb) return cb;
				}
			}
			return false;
		}

		/**
		 * "Sleeping" sprites get temporarily ignored during physics
		 * simulation. A sprite starts "sleeping" when it stops moving and
		 * doesn't collide with anything that it wasn't already touching.
		 *
		 * This is an important performance optimization that you probably
		 * shouldn't disable for every sprite in the world.
		 * @type {Boolean}
		 * @default true
		 */
		get allowSleeping() {
			return this.getAllowSleeping();
		}
		set allowSleeping(val) {
			this.setAllowSleeping(val);
		}

		/**
		 * Finds the first sprite (with a physics body) that
		 * intersects a ray (line), excluding any sprites that intersect
		 * with the starting point.
		 *
		 * This function can also be given start and end points.
		 * @param {Object} startPos - starting position of the ray cast
		 * @param {Number} direction - direction of the ray
		 * @param {Number} maxDistance - max distance the ray should check
		 * @returns {Sprite} The first sprite the ray hits or undefined
		 */
		rayCast(startPos, direction, maxDistance) {
			let sprites = this.rayCastAll(startPos, direction, maxDistance, () => true);
			return sprites[0];
		}

		/**
		 * Finds sprites (with physics bodies) that intersect
		 * a line (ray), excluding any sprites that intersect the
		 * starting point.
		 *
		 * This function can also be given start and end points.
		 * @param {Object} startPos - starting position of the ray cast
		 * @param {Number} direction - direction of the ray
		 * @param {Number} maxDistance - max distance the ray should check
		 * @param {Function} [limiter] - limiter function that's run each time the ray intersects a sprite, return true to stop the ray
		 * @returns {Sprite[]} An array of sprites that the ray cast hit, sorted by distance. The sprite closest to the starting point will be at index 0.
		 */
		rayCastAll(startPos, direction, maxDistance, limiter) {
			let ts = $.allSprites.tileSize;
			let start = scaleTo(startPos.x, startPos.y, ts);

			let end;
			if (typeof arguments[1] == 'number') {
				end = scaleTo(startPos.x + maxDistance * $.cos(direction), startPos.y + maxDistance * $.sin(direction), ts);
			} else {
				let endPos = arguments[1];
				limiter ??= arguments[2];
				end = scaleTo(endPos.x, endPos.y, ts);
			}

			let results = [];
			let maxFraction = 1;

			super.rayCast(start, end, function (fixture, point, normal, fraction) {
				let sprite = fixture.getBody().sprite;

				let shouldLimit = limiter && limiter(sprite);

				// TODO provide advanced info: point and angle of intersection
				results.push({
					sprite,
					// point,
					// normal,
					fraction
				});

				// limit the ray cast so it can't go beyond this sprite
				if (shouldLimit) {
					if (fraction < maxFraction) {
						maxFraction = fraction;
					}
					return fraction;
				}
				return 1; // keep casting the full length of the ray
			});

			// sort results by the distance from the starting position
			results.sort((a, b) => a.fraction - b.fraction);

			let sprites = [];

			for (let res of results) {
				if (res.fraction <= maxFraction) {
					sprites.push(res.sprite);
				}
			}

			return sprites;
		}
	};

	/**
	 * @class
	 */
	this.Camera = class {
		/**
		 * <a href="https://p5play.org/learn/camera.html">
		 * Look at the Camera reference pages before reading these docs.
		 * </a>
		 *
		 * A `camera` object is created automatically when p5play loads.
		 * Currently, there can only be one camera per sketch (instance
		 * of p5 or q5).
		 *
		 * A camera facilitates zooming and scrolling for scenes extending beyond
		 * the canvas. Moving the camera does not actually move the sprites.
		 *
		 * The camera is automatically created on the first draw cycle.
		 *
		 * The camera wraps the whole drawing cycle in a transformation
		 * matrix (using `push`/`pushMatrix`) but it can be disabled
		 * during the draw cycle to draw interface elements in an
		 * absolute position.
		 */
		constructor() {
			// camera position
			this._pos = $.createVector.call($);

			// camera translation
			this.__pos = { x: 0, y: 0, rounded: {} };

			/**
			 * Read only. True if the camera is active.
			 * Use camera.on() to activate the camera.
			 * @type {Boolean}
			 * @default false
			 */
			this.isActive = false;

			this.bound = {
				min: { x: 0, y: 0 },
				max: { x: 0, y: 0 }
			};

			this._zoomIdx = -1;

			this._zoom = 1;

			this._destIdx = 0;
		}

		/**
		 * The camera's position. {x, y}
		 * @type {Object}
		 */
		get pos() {
			return this._pos;
		}
		set pos(val) {
			this.x = val.x;
			this.y = val.y;
		}
		/**
		 * The camera's position. Alias for pos.
		 * @type {Object}
		 */
		get position() {
			return this._pos;
		}
		set position(val) {
			this.x = val.x;
			this.y = val.y;
		}

		_calcBoundsX(val) {
			let mod = $.canvas.hw / this._zoom;
			this.bound.min.x = val - mod;
			this.bound.max.x = val + mod;
		}

		_calcBoundsY(val) {
			let mod = $.canvas.hh / this._zoom;
			this.bound.min.y = val - mod;
			this.bound.max.y = val + mod;
		}

		/**
		 * The camera x position.
		 * @type {Number}
		 */
		get x() {
			return this._pos.x;
		}
		set x(val) {
			if (val === undefined || isNaN(val)) return;
			this._pos.x = val;
			let x = -val;
			if ($.canvas.renderer == 'c2d') x += $.canvas.hw / this._zoom;
			this.__pos.x = x;
			if ($.allSprites.pixelPerfect) {
				this.__pos.rounded.x = Math.round(x);
			}
			this._calcBoundsX(val);
		}

		/**
		 * The camera y position.
		 * @type {Number}
		 */
		get y() {
			return this._pos.y;
		}
		set y(val) {
			if (val === undefined || isNaN(val)) return;
			this._pos.y = val;
			let y = -val;
			if ($.canvas.renderer == 'c2d') y += $.canvas.hh / this._zoom;
			this.__pos.y = y;
			if ($.allSprites.pixelPerfect) {
				this.__pos.rounded.y = Math.round(y);
			}
			this._calcBoundsY(val);
		}

		/**
		 * Moves the camera to a position. Similar to `sprite.moveTo`.
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} speed
		 * @returns {Promise} resolves true when the camera reaches the target position
		 */
		moveTo(x, y, speed) {
			if (x === undefined) return;
			if (isNaN(x)) {
				speed = y;
				y = x.y;
				x = x.x;
			}
			speed ??= 1;
			if (speed <= 0) {
				console.warn('camera.moveTo: speed should be a positive number');
				return Promise.resolve(false);
			}
			let a = y - this.y;
			let b = x - this.x;
			let c = Math.sqrt(a * a + b * b);
			let percent = speed / c;
			let velX = b * percent;
			let velY = a * percent;

			this._destIdx++;
			let destIdx = this._destIdx;
			let steps = Math.ceil(c / speed);

			return (async () => {
				for (let i = 0; i < steps; i++) {
					this.x += velX;
					this.y += velY;
					await $.sleep();
					if (destIdx != this._destIdx) return false;
				}
				this.x = x;
				this.y = y;
				return true;
			})();
		}

		/**
		 * Camera zoom.
		 *
		 * A scale of 1 will be the normal size. Setting it to 2
		 * will make everything appear twice as big. .5 will make
		 * everything look half size.
		 * @type {Number}
		 * @default 1
		 */
		get zoom() {
			return this._zoom;
		}
		set zoom(val) {
			if (val === undefined || isNaN(val)) return;
			this._zoom = val;
			let x = -this._pos.x;
			if ($.canvas.renderer == 'c2d') x += $.canvas.hw / val;
			let y = -this._pos.y;
			if ($.canvas.renderer == 'c2d') y += $.canvas.hh / val;
			this.__pos.x = x;
			this.__pos.y = y;
			if ($.allSprites.pixelPerfect) {
				this.__pos.rounded.x = Math.round(x);
				this.__pos.rounded.y = Math.round(y);
			}
			this._calcBoundsX(this._pos.x);
			this._calcBoundsY(this._pos.y);
		}

		/**
		 * Zoom the camera at a given speed.
		 *
		 * @param {Number} target - The target zoom
		 * @param {Number} speed - The amount of zoom per frame
		 * @returns {Promise} resolves true when the camera reaches the target zoom
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
					await $.sleep();
				}
				this.zoom = target;
				return true;
			})();
		}

		/**
		 * Activates the camera.
		 *
		 * The canvas will be drawn according to the camera position and scale until
		 * camera.off() is called.
		 */
		on() {
			if (!this.isActive) {
				$.push();
				$.scale(this._zoom);
				if (!$.allSprites.pixelPerfect) {
					$.translate(this.__pos.x, this.__pos.y);
				} else {
					this.__pos.rounded.x ??= Math.round(this.__pos.x);
					this.__pos.rounded.y ??= Math.round(this.__pos.y);
					$.translate(this.__pos.rounded.x, this.__pos.rounded.y);
				}
				this.isActive = true;
			}
		}

		/**
		 * Deactivates the camera.
		 *
		 * The canvas will be drawn normally, ignoring the camera's position
		 * and scale until camera.on() is called.
		 */
		off() {
			if (this.isActive) {
				$.pop();
				this.isActive = false;
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

		let shouldOverlap = a._hasOverlap[b._uid] ?? b._hasOverlap[a._uid];

		// if `a` has an overlap enabled with `b` their colliders should
		// not produce a contact event, the overlap contact event should
		// only be produced between their sensors
		if (shouldOverlap) return false;
		return true;
	};

	/**
	 * @class
	 */
	this.Tiles = class {
		/**
		 * <a href="https://p5play.org/learn/tiles.html">
		 * Look at the Tiles reference pages before reading these docs.
		 * </a>
		 *
		 * Returns a group containing all the tile sprites created by
		 * the `Tiles` constructor.
		 *
		 * @param {String} tiles
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} w
		 * @param {Number} h
		 */
		constructor(tiles, x, y, w, h) {
			if (typeof tiles == 'string') {
				if (tiles[0] == '\n') tiles = tiles.slice(1);
				tiles = tiles.replaceAll('\t', '  ');
				tiles = tiles.split('\n');
			}

			x ??= 0;
			y ??= 0;
			w ??= 1;
			h ??= 1;

			let sprites = new $.Group();

			for (let row = 0; row < tiles.length; row++) {
				for (let col = 0; col < tiles[row].length; col++) {
					let t = tiles[row][col];
					if (t == ' ' || t == '.') continue;
					let ani, g;
					let groups = Object.values($.p5play.groups);
					for (g of groups) {
						ani = g.animations[t];
						if (ani) break;
					}
					if (ani) {
						sprites.push(new g.Sprite(ani, x + col * w, y + row * h));
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
						sprites.push(new g.Sprite(x + col * w, y + row * h));
						continue;
					}
					let s;
					for (s of $.allSprites) {
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

			return sprites;
		}
	};

	/**
	 * Use of `new Tiles()` is preferred.
	 *
	 * @deprecated
	 * @func createTiles
	 */
	this.createTiles = function (tiles, x, y, w, h) {
		return new $.Tiles(tiles, x, y, w, h);
	};

	/**
	 * @class
	 */
	this.Joint = class {
		/**
		 * Using this Joint class directly is not recommended, but
		 * if it is used a GlueJoint will be created.
		 *
		 * It's better to use a specific joint class constructor:
		 *
		 * GlueJoint, DistanceJoint, WheelJoint, HingeJoint,
		 * SliderJoint, or RopeJoint.
		 *
		 * All other joint classes extend this class. Joint type
		 * can not be changed after a joint is created.
		 *
		 * @param {Sprite} spriteA
		 * @param {Sprite} spriteB
		 * @param {String} [type]
		 */
		constructor(spriteA, spriteB, type) {
			if (!spriteA?._isSprite || !spriteB?._isSprite) {
				throw new Error('The Joint constructor requires two sprites as input.');
			}

			if (!spriteA.body) spriteA.addDefaultSensors();
			if (!spriteB.body) spriteB.addDefaultSensors();

			/**
			 * The first sprite in the joint.
			 * @type {Sprite}
			 */
			this.spriteA = spriteA;

			/**
			 * The second sprite in the joint.
			 * @type {Sprite}
			 */
			this.spriteB = spriteB;

			type ??= 'glue';
			/**
			 * Read only. The type of joint. Can be one of:
			 *
			 * "glue", "distance", "wheel", "hinge", "slider", or "rope".
			 *
			 * Can't be changed after the joint is created.
			 * @type {String}
			 */
			this.type = type;

			if (type == 'glue') {
				let j = pl.WeldJoint({}, spriteA.body, spriteB.body, spriteA.body.getWorldCenter());
				this._createJoint(j);
			}

			let _this = this;

			if (type != 'glue' && type != 'slider' && type != 'rope') {
				for (let l of ['A', 'B']) {
					if (l == 'A' && type == 'wheel') continue;

					const prop = '_offset' + l;
					this[prop] = $.createVector.call($);

					for (let axis of ['x', 'y']) {
						Object.defineProperty(this[prop], axis, {
							get() {
								let val = (_this._j['m_localAnchor' + l][axis] / _this['sprite' + l].tileSize) * $.world.meterSize;
								return $.p5play.friendlyRounding ? fixRound(val) : val;
							},
							set(val) {
								_this._j['m_localAnchor' + l][axis] = (val / $.world.meterSize) * _this['sprite' + l].tileSize;
								if (_this.type == 'distance' || _this.type == 'rope') {
									_this._j.m_length = pl.Vec2.distance(
										_this._j.m_bodyA.getWorldPoint(_this._j.m_localAnchorA),
										_this._j.m_bodyB.getWorldPoint(_this._j.m_localAnchorB)
									);
								} else if (_this.type == 'hinge' || _this.type == 'wheel') {
									let o;
									if (l == 'A') o = 'B';
									else o = 'A';
									// body o's local point of body l anchor's world point
									_this._j['m_localAnchor' + o][axis] = _this._j['m_body' + o].getLocalPoint(
										_this._j['m_body' + l].getWorldPoint(_this._j['m_localAnchor' + l])
									)[axis];
								}
							}
						});
					}
				}
			}

			let removeProps = [];
			if (type == 'distance' || type == 'glue' || type == 'rope') {
				removeProps.push('enableMotor', 'maxPower', 'motorSpeed', 'power', 'speed');
			}
			if (type == 'rope') {
				removeProps.push('damping', 'springiness');
			}

			let def = {};
			for (let prop of removeProps) {
				def[prop] = { value: null, enumerable: false };
			}
			Object.defineProperties(this, def);

			/**
			 * Determines whether to draw the joint if spriteA
			 * or spriteB is drawn.
			 * @type {Boolean}
			 * @default true
			 */
			this.visible = true;

			spriteA.joints.push(this);
			spriteB.joints.push(this);
		}

		_createJoint(j) {
			this._j = $.world.createJoint(j);
		}

		_display() {
			this._draw(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
			this.visible = null;
		}

		_draw(xA, yA, xB, yB) {
			if (yB) {
				$.line(xA, yA, xB, yB);
			} else {
				$.point(xA, yA);
			}
		}

		/**
		 * Function that draws the joint. Can be overridden by the user.
		 * @type {Function}
		 * @param {Number} xA
		 * @param {Number} yA
		 * @param {Number} [xB]
		 * @param {Number} [yB]
		 */
		get draw() {
			return this._display;
		}
		set draw(val) {
			this._draw = val;
		}

		/**
		 * Offset to the joint's anchorA position from the center of spriteA.
		 *
		 * Only distance and hinge joints have an offsetA.
		 * @type {Vector}
		 * @default {x: 0, y: 0}
		 */
		get offsetA() {
			return this._offsetA;
		}
		set offsetA(val) {
			this._offsetA.x = val.x;
			this._offsetA.y = val.y;
		}

		/**
		 * Offset to the joint's anchorB position from the center of spriteB.
		 *
		 * Only distance, hinge, and wheel joints have an offsetB.
		 * @type {Vector}
		 * @default {x: 0, y: 0}
		 */
		get offsetB() {
			return this._offsetB;
		}
		set offsetB(val) {
			this._offsetB.x = val.x;
			this._offsetB.y = val.y;
		}

		/**
		 * The springiness of the joint, a 0-1 ratio.
		 *
		 * 0.0 makes the joint completely rigid, and
		 * 1.0 turns the joint into a super loose spring,
		 * like a broken slinky that was overextended.
		 *
		 * Springiness is a user friendly wrapper around Box2D's spring
		 * frequency joint parameter. It's 0-1 ratio is piecewise mapped
		 * to the range of 30-0.2hz, except 0 remains 0.
		 *
		 * 0.0 -> 0hz (perfectly rigid)
		 * >0.0-0.1 -> 30hz-4hz (steel rod)
		 * 0.1-0.5 -> 4hz-2.5hz (tight spring)
		 * 0.5-0.8 -> 2.5hz-1hz (bouncy spring)
		 * 0.8-0.9 -> 1hz-0.5hz (slinky)
		 * 0.9-1.0 -> 0.5hz-0.2hz (bungee cord)
		 * @type {Number}
		 * @default 0.0
		 */
		get springiness() {
			return this._springiness;
		}
		set springiness(val) {
			if (val > 0) {
				if (val < 0.1) {
					val = $.map(val, 0, 0.1, 30, 4);
				} else if (val < 0.5) {
					val = $.map(val, 0.1, 0.5, 4, 2.5);
				} else if (val < 0.8) {
					val = $.map(val, 0.5, 0.8, 2.5, 1);
				} else if (val < 0.9) {
					val = $.map(val, 0.8, 0.9, 1, 0.5);
				} else {
					val = $.map(val, 0.9, 1.0, 0.5, 0.2);
				}
			}
			this._springiness = val;

			if (this.type != 'wheel') return this._j.setFrequency(val);
			this._j.setSpringFrequencyHz(val);
		}

		/**
		 * Damping only effects joint's that have a
		 * springiness greater than 0.
		 *
		 * Damping is a 0-1 ratio describing how quickly the joint loses
		 * vibrational energy.
		 *
		 * 0.0 lets the joint continue to spring up and down very easily.
		 * 1.0 makes the joint lose vibrational energy immediately,
		 * making the joint completely rigid, regardless of its springiness.
		 * @type {Number}
		 * @default 0.0
		 */
		get damping() {
			if (this.type != 'wheel') {
				return this._j.getDampingRatio();
			}
			return this._j.getSpringDampingRatio();
		}
		set damping(val) {
			if (this.type != 'wheel') {
				this._j.setDampingRatio(val);
				return;
			}
			this._j.setSpringDampingRatio(val);
		}

		/**
		 * The current speed of the joint's motor.
		 * @type {Number}
		 * @default 0
		 */
		get speed() {
			return this._j.getJointSpeed();
		}
		set speed(val) {
			if (!this._j.isMotorEnabled()) {
				this._j.enableMotor(true);
			}
			this._j.setMotorSpeed(val);
		}

		get motorSpeed() {
			return this._j.getMotorSpeed();
		}

		/**
		 * Enable or disable the joint's motor.
		 * Disabling the motor is like putting a
		 * car in neutral.
		 * @type {Boolean}
		 */
		get enableMotor() {
			return this._j.isMotorEnabled();
		}
		set enableMotor(val) {
			this._j.enableMotor(val);
		}

		/**
		 * Max power is how the amount of torque a joint motor can exert
		 * around its axis of rotation.
		 * @type {Number}
		 * @default 0
		 */
		get maxPower() {
			return this._j.getMaxMotorTorque();
		}
		set maxPower(val) {
			if (!this._j.isMotorEnabled() && val) {
				this._j.enableMotor(true);
			}
			this._j.setMaxMotorTorque(val);
			if (!val) this._j.enableMotor(false);
		}

		/**
		 * Read only.  The joint's current power, the amount of torque
		 * being applied on the joint's axis of rotation.
		 * @type {Number}
		 * @default 0
		 */
		get power() {
			return this._j.getMotorTorque();
		}

		/**
		 * Set to true if you want the joint's sprites to collide with
		 * each other.
		 * @type {Boolean}
		 * @default false
		 */
		get collideConnected() {
			return this._j.getCollideConnected();
		}
		set collideConnected(val) {
			this._j.m_collideConnected = val;
		}

		/**
		 * Read only. The joint's reaction force.
		 */
		get reactionForce() {
			return this._j.getReactionForce($.world._timeStep);
		}

		/**
		 * Read only. The joint's reaction torque.
		 */
		get reactionTorque() {
			return this._j.getReactionTorque($.world._timeStep);
		}

		/**
		 * Removes the joint from the world and from each of the
		 * sprites' joints arrays.
		 */
		remove() {
			if (this._removed) return;
			this.spriteA.joints.splice(this.spriteA.joints.indexOf(this), 1);
			this.spriteB.joints.splice(this.spriteB.joints.indexOf(this), 1);
			$.world.destroyJoint(this._j);
			this._removed = true;
		}
	};

	/**
	 * @class
	 * @extends Joint
	 */
	this.GlueJoint = class extends $.Joint {
		/**
		 * Glue joints are used to glue two sprites together.
		 *
		 * @param {Sprite} spriteA
		 * @param {Sprite} spriteB
		 */
		constructor(spriteA, spriteB) {
			super(...arguments, 'glue');
		}
	};

	/**
	 * @class
	 * @extends Joint
	 */
	this.DistanceJoint = class extends $.Joint {
		/**
		 * Distance joints are used to constrain the distance
		 * between two sprites.
		 *
		 * @param {Sprite} spriteA
		 * @param {Sprite} spriteB
		 */
		constructor(spriteA, spriteB) {
			super(...arguments, 'distance');

			let j = pl.DistanceJoint(
				{},
				spriteA.body,
				spriteB.body,
				spriteA.body.getWorldCenter(),
				spriteB.body.getWorldCenter()
			);
			this._createJoint(j);
		}

		_display() {
			let ancA, ancB;
			if (this.offsetA.x || this.offsetA.y) {
				ancA = this.spriteA.body.getWorldPoint(this._j.m_localAnchorA);
				ancA = scaleFrom(ancA.x, ancA.y, this.spriteA.tileSize);
			}
			if (this.offsetB.x || this.offsetB.y) {
				ancB = this.spriteB.body.getWorldPoint(this._j.m_localAnchorB);
				ancB = scaleFrom(ancB.x, ancB.y, this.spriteB.tileSize);
			}
			this._draw(
				!ancA ? this.spriteA.x : ancA.x,
				!ancA ? this.spriteA.y : ancA.y,
				!ancB ? this.spriteB.x : ancB.x,
				!ancB ? this.spriteB.y : ancB.y
			);
			this.visible = null;
		}
	};

	/**
	 * @class
	 * @extends Joint
	 */
	this.WheelJoint = class extends $.Joint {
		/**
		 * Wheel joints can be used to create vehicles!
		 *
		 * By default the motor is disabled, angle is 90 degrees,
		 * maxPower is 1000, springiness is 0.1, and damping is 0.7.
		 *
		 * @param {Sprite} spriteA - the vehicle body
		 * @param {Sprite} spriteB - the wheel
		 */
		constructor(spriteA, spriteB) {
			super(...arguments, 'wheel');

			let j = pl.WheelJoint(
				{
					maxMotorTorque: 1000,
					frequencyHz: 4,
					dampingRatio: 0.7
				},
				spriteA.body,
				spriteB.body,
				spriteB.body.getWorldCenter(),
				new pl.Vec2(0, 1)
			);
			this._createJoint(j);
			this._angle = $._angleMode == DEGREES ? 90 : 1.5707963267948966;
		}

		_display() {
			let xA = this.spriteA.x;
			let yA = this.spriteA.y;

			let xB, yB;
			if (!this.offsetB.x && !this.offsetB.y) {
				xB = this.spriteB.x;
				yB = this.spriteB.y;
			} else {
				let ancB = this.spriteB.body.getWorldPoint(this._j.m_localAnchorB);
				ancB = scaleFrom(ancB.x, ancB.y, this.spriteB.tileSize);
				xB = ancB.x;
				yB = ancB.y;
			}

			// Calculate the slopes of the lines
			let slopeA = $.tan(this.spriteA.rotation);
			let slopeB = $.tan(this._angle + this.spriteA.rotation);

			// Calculate the intersection point
			let xI = (yB - yA + slopeA * xA - slopeB * xB) / (slopeA - slopeB);
			let yI = slopeA * (xI - xA) + yA;

			this._draw(xI, yI, xB, yB);
			this.visible = null;
		}

		/**
		 * The angle at which the wheel is attached to the vehicle body.
		 *
		 * The default is 90 degrees or PI/2 radians, which is vertical.
		 * @type {Number}
		 * @default 90
		 */
		get angle() {
			return this._angle;
		}
		set angle(val) {
			if (val == this._angle) return;
			this._angle = val;
			this._j.m_localXAxisA = new pl.Vec2($.cos(val), $.sin(val));
			this._j.m_localXAxisA.normalize();
			this._j.m_localYAxisA = pl.Vec2.crossNumVec2(1.0, this._j.m_localXAxisA);
		}
	};

	/**
	 * @class
	 * @extends Joint
	 */
	this.HingeJoint = class extends $.Joint {
		/**
		 * Hinge joints attach two sprites together at a pivot point,
		 * constraining them to rotate around this point, like a hinge.
		 *
		 * A known as a revolute joint.
		 *
		 * @param {Sprite} spriteA
		 * @param {Sprite} spriteB
		 */
		constructor(spriteA, spriteB) {
			super(...arguments, 'hinge');

			let j = pl.RevoluteJoint({}, spriteA.body, spriteB.body, spriteA.body.getWorldCenter());
			this._createJoint(j);
		}

		_display() {
			const offsetAx = this.offsetA.x;
			const offsetAy = this.offsetA.y;
			const rotationA = this.spriteA.rotation;

			const rotatedOffsetAx = offsetAx * $.cos(rotationA) - offsetAy * $.sin(rotationA);
			const rotatedOffsetAy = offsetAx * $.sin(rotationA) + offsetAy * $.cos(rotationA);

			this._draw(this.spriteA.x + rotatedOffsetAx, this.spriteA.y + rotatedOffsetAy);
			this.visible = null;
		}

		/**
		 * The joint's range of rotation. Setting the range
		 * changes the joint's upper and lower limits.
		 * @type {Number}
		 * @default undefined
		 */
		get range() {
			return this.upperLimit - this.lowerLimit;
		}
		set range(val) {
			val /= 2;
			this.upperLimit = val;
			this.lowerLimit = -val;
		}

		/**
		 * The lower limit of rotation.
		 * @type {Number}
		 * @default undefined
		 */
		get lowerLimit() {
			let val = this._j.getLowerLimit();
			if ($._angleMode == 'radians') return val;
			return $.degrees(val);
		}
		set lowerLimit(val) {
			if (!this._j.isLimitEnabled()) {
				this._j.enableLimit(true);
			}
			this.spriteA.body.setAwake(true);
			this.spriteB.body.setAwake(true);
			if ($._angleMode == DEGREES) val = $.radians(val);
			this._j.m_lowerAngle = val;
		}

		/**
		 * The upper limit of rotation.
		 * @type {Number}
		 * @default undefined
		 */
		get upperLimit() {
			let val = this._j.getUpperLimit();
			if ($._angleMode == 'radians') return val;
			return $.degrees(val);
		}
		set upperLimit(val) {
			if (!this._j.isLimitEnabled()) {
				this._j.enableLimit(true);
			}
			this.spriteA.body.setAwake(true);
			this.spriteB.body.setAwake(true);
			if ($._angleMode == DEGREES) val = $.radians(val);
			this._j.m_upperAngle = val;
		}

		/**
		 * Read only. The joint's current angle of rotation.
		 * @type {Number}
		 * @default 0
		 */
		get angle() {
			let ang = this._j.getJointAngle();
			if ($._angleMode == 'radians') return ang;
			return $.radians(ang);
		}
	};
	$.RevoluteJoint = $.HingeJoint;

	/**
	 * @class
	 * @extends Joint
	 */
	this.SliderJoint = class extends $.Joint {
		/**
		 * A slider joint constrains the motion of two sprites to sliding
		 * along a common axis, without rotation.
		 *
		 * Also known as a prismatic joint.
		 *
		 * @param {Sprite} spriteA
		 * @param {Sprite} spriteB
		 */
		constructor(spriteA, spriteB) {
			super(...arguments, 'slider');

			let j = pl.PrismaticJoint(
				{
					lowerTranslation: -1,
					upperTranslation: 1,
					enableLimit: true,
					maxMotorForce: 50,
					motorSpeed: 0,
					enableMotor: true
				},
				spriteA.body,
				spriteB.body,
				spriteA.body.getWorldCenter(),
				new pl.Vec2(1, 0)
			);
			this._createJoint(j);
			this._angle = 0;
		}

		/**
		 * The angle of the joint's axis which its sprites slide along.
		 * @type {Number}
		 * @default 0
		 */
		get angle() {
			return this._angle;
		}
		set angle(val) {
			if (val == this._angle) return;
			this._angle = val;
			this._j.m_localXAxisA = new pl.Vec2($.cos(val), $.sin(val));
			this._j.m_localXAxisA.normalize();
			this._j.m_localYAxisA = pl.Vec2.crossNumVec2(1.0, this._j.m_localXAxisA);
		}

		/**
		 * The joint's range of translation. Setting the range
		 * changes the joint's upper and lower limits.
		 * @type {Number}
		 * @default undefined
		 */
		get range() {
			return this.upperLimit - this.lowerLimit;
		}
		set range(val) {
			val /= 2;
			this.upperLimit = val;
			this.lowerLimit = -val;
		}

		/**
		 * The mathematical lower (not positionally lower)
		 * limit of translation.
		 * @type {Number}
		 * @default undefined
		 */
		get lowerLimit() {
			return (this._j.getLowerLimit() / this.spriteA.tileSize) * $.world.meterSize;
		}
		set lowerLimit(val) {
			if (!this._j.isLimitEnabled()) {
				this._j.enableLimit(true);
			}
			val = (val * this.spriteA.tileSize) / $.world.meterSize;
			this._j.setLimits(val, this._j.getUpperLimit());
		}

		/**
		 * The mathematical upper (not positionally higher)
		 * limit of translation.
		 * @type {Number}
		 * @default undefined
		 */
		get upperLimit() {
			return (this._j.getUpperLimit() / this.spriteA.tileSize) * $.world.meterSize;
		}
		set upperLimit(val) {
			if (!this._j.isLimitEnabled()) {
				this._j.enableLimit(true);
			}
			val = (val * this.spriteA.tileSize) / $.world.meterSize;
			this._j.setLimits(this._j.getLowerLimit(), val);
		}
	};
	$.PrismaticJoint = $.SliderJoint;

	/**
	 * @class
	 * @extends Joint
	 */
	this.RopeJoint = class extends $.Joint {
		/**
		 * A Rope joint prevents two sprites from going further
		 * than a certain distance from each other, which is
		 * defined by the max length of the rope, but they do allow
		 * the sprites to get closer together.
		 *
		 * @param {Sprite} spriteA
		 * @param {Sprite} spriteB
		 */
		constructor(spriteA, spriteB) {
			super(...arguments, 'rope');

			let j = pl.RopeJoint(
				{
					maxLength: 1
				},
				spriteA.body,
				spriteB.body,
				spriteA.body.getWorldCenter()
			);
			this._createJoint(j);
			this._j.m_localAnchorB.x = 0;
			this._j.m_localAnchorB.y = 0;
		}

		/**
		 * The maximum length of the rope.
		 */
		get maxLength() {
			return scaleXFrom(this._j.getMaxLength(), this.spriteA.tileSize);
		}
		set maxLength(val) {
			this._j.setMaxLength(scaleXTo(val, this.spriteA.tileSize));
		}
	};

	/**
	 * @class
	 * @extends Joint
	 */
	this.GrabberJoint = class extends this.Joint {
		/**
		 * A Grabber joint enables you to grab sprites and move them with
		 * a max force towards a target position.
		 *
		 * @param {Sprite} sprite - the sprite to grab
		 */
		constructor(sprite) {
			super(sprite, sprite, 'grab');

			this._target = { x: 0, y: 0 };
			this.__target = new pl.Vec2(0, 0);

			let j = pl.MouseJoint(
				{
					maxForce: 1000,
					frequencyHz: 3,
					dampingRatio: 0.9,
					target: sprite.body.getPosition()
				},
				sprite.body,
				sprite.body
			);
			this._createJoint(j);
		}

		_draw() {
			$.line(this.spriteA.x, this.spriteA.y, this._target.x, this._target.y);
		}

		/**
		 * The target position of the joint that the sprite will be
		 * moved towards. Must be an object with x and y properties.
		 * @type {Object}
		 */
		get target() {
			return this._target;
		}
		set target(pos) {
			this._target.x = pos.x;
			this._target.y = pos.y;
			this.__target.x = pos.x / $.world.meterSize;
			this.__target.y = pos.y / $.world.meterSize;
			this._j.setTarget(this.__target);
		}

		/**
		 * The maximum force that the joint can exert on the sprite.
		 * @type {Number}
		 * @default 1000
		 */
		get maxForce() {
			return this._j.getMaxForce();
		}
		set maxForce(val) {
			this._j.setMaxForce(val);
		}
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

	function isArrowFunction(fn) {
		return !/^(?:(?:\/\*[^(?:\*\/)]*\*\/\s*)|(?:\/\/[^\r\n]*))*\s*(?:(?:(?:async\s(?:(?:\/\*[^(?:\*\/)]*\*\/\s*)|(?:\/\/[^\r\n]*))*\s*)?function|class)(?:\s|(?:(?:\/\*[^(?:\*\/)]*\*\/\s*)|(?:\/\/[^\r\n]*))*)|(?:[_$\w][\w0-9_$]*\s*(?:\/\*[^(?:\*\/)]*\*\/\s*)*\s*\()|(?:\[\s*(?:\/\*[^(?:\*\/)]*\*\/\s*)*\s*(?:(?:['][^']+['])|(?:["][^"]+["]))\s*(?:\/\*[^(?:\*\/)]*\*\/\s*)*\s*\]\())/.test(
			fn.toString()
		);
	}

	/*
	 * Checks if the given string contains a valid collider type
	 * or collider type code letter:
	 *
	 * 'd' or 'dynamic'
	 * 's' or 'static'
	 * 'k' or 'kinematic'
	 * 'n' or 'none'
	 */
	function isColliderType(t) {
		if (t == 'd' || t == 's' || t == 'k' || t == 'n') return true;
		let abr = t.slice(0, 2);
		return abr == 'dy' || abr == 'st' || abr == 'ki' || abr == 'no';
	}

	/*
	 * Returns an array with the line length, angle, and number of sides
	 * of a regular polygon, which is used internally to create a Sprite
	 * using line mode.
	 */
	function getRegularPolygon(lineLength, name) {
		let l = lineLength;
		let n = name.toLowerCase();
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
		if (l == lineLength) throw new Error('Invalid, not a regular polygon: ' + name);
		return l;
	}

	// default color palettes
	$.p5play.palettes = [
		{
			a: 'aqua',
			b: 'black',
			c: 'crimson',
			d: 'darkviolet',
			e: 'peachpuff',
			f: 'olive',
			g: 'green',
			h: 'hotpink',
			i: 'indigo',
			j: 'navy',
			k: 'khaki',
			l: 'lime',
			m: 'magenta',
			n: 'brown',
			o: 'orange',
			p: 'pink',
			q: 'turquoise',
			r: 'red',
			s: 'skyblue',
			t: 'tan',
			u: 'blue',
			v: 'violet',
			w: 'white',
			x: 'gold',
			y: 'yellow',
			z: 'gray'
		}
	];

	/**
	 * Gets a color from a color palette.
	 * @param {String} c - A single character, a key found in the color palette object.
	 * @param {Number|Object} palette - can be a palette object or number index
	 * in the system's palettes array.
	 * @returns {String} a hex color string
	 */
	this.colorPal = (c, palette) => {
		if (c instanceof p5.Color) return c;
		if (typeof palette == 'number') {
			palette = $.p5play.palettes[palette];
		}
		palette ??= $.p5play.palettes[0];
		let clr = palette[c];
		if (!clr) return $.color(0, 0, 0, 0);
		return $.color(clr);
	};

	/**
	 * Creates a new image of an emoji, trimmed to the emoji's dimensions.
	 * @param {String} emoji
	 * @param {Number} textSize
	 * @returns {Image} emojiImage
	 * @example
	 * let img = new EmojiImage('🏀', 32);
	 */
	this.EmojiImage = function (emoji, textSize) {
		textSize *= $.p5play.emojiScale;
		let size = textSize * 1.25;
		let g = $.createGraphics(size, size, $.P2D);
		g.textSize(textSize);
		g.textAlign($.CENTER);
		g.textFont($.canvas.renderer != 'webgpu' ? $.textFont() : $._g.textFont());
		g.text(emoji, size / 2, textSize);

		// same code as img.trim() in q5.js
		let ctx = g.drawingContext;
		let pd = g._pixelDensity || 1;
		let w = g.canvas.width;
		let h = g.canvas.height;
		let data = ctx.getImageData(0, 0, w, h).data;
		let left = w,
			right = 0,
			top = h,
			bottom = 0;

		let i = 3;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				if (data[i] !== 0) {
					if (x < left) left = x;
					if (x > right) right = x;
					if (y < top) top = y;
					if (y > bottom) bottom = y;
				}
				i += 4;
			}
		}
		top = Math.floor(top / pd);
		bottom = Math.floor(bottom / pd);
		left = Math.floor(left / pd);
		right = Math.floor(right / pd);

		g = g.get(left, top, right - left + 1, bottom - top + 1);
		g.url = emoji;
		return g;
	};

	/**
	 * Create pixel art images from a string. Each character in the
	 * input string represents a color value defined in the palette
	 * object.
	 *
	 * @func spriteArt
	 * @param {String} txt - each character represents a pixel color value
	 * @param {Number} scale - the scale of the image
	 * @param {Number|Object} palette - color palette
	 * @returns {Image} An Image object
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
			palette = $.p5play.palettes[palette];
		}
		palette ??= $.p5play.palettes[0];
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
		let img = $.createImage(w * scale, h * scale);
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
		$.p5play.onImageLoad(img);
		return img; // return the p5 graphics object
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
		return new $.Sprite(...arguments);
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
		return new $.Group(...arguments);
	};

	/**
	 * Alias for `new Ani()`
	 *
	 * Load animations in the `preload` function if you need to use
	 * them when your program starts.
	 *
	 * @returns {Ani}
	 */
	this.loadAnimation = this.loadAni = function () {
		return new $.Ani(...arguments);
	};

	/**
	 * Displays an animation. Similar to the `image` function.
	 *
	 * @param {Ani} ani - Animation to be displayed
	 * @param {Number} x - position of the animation on the canvas
	 * @param {Number} y - position of the animation on the canvas
	 * @param {Number} r - rotation of the animation
	 * @param {Number} sX - scale of the animation in the x direction
	 * @param {Number} sY - scale of the animation in the y direction
	 */
	this.animation = function (ani, x, y, r, sX, sY) {
		if (ani.visible) ani.update();
		ani.draw(x, y, r, sX, sY);
	};

	/**
	 * Delays code execution in an async function for the specified time.
	 *
	 * If no input is given, it waits until a new animation frame is ready
	 * to be drawn using the `window.requestAnimationFrame` function.
	 *
	 * @param {Number} millisecond
	 * @returns {Promise} A Promise that fulfills after the specified time.
	 *
	 * @example
	 * async function startGame() {
	 *   await delay(3000);
	 * }
	 */
	this.delay = (milliseconds) => {
		if (!milliseconds) return new Promise(requestAnimationFrame);
		// else it wraps setTimeout in a Promise
		return new Promise((resolve) => {
			setTimeout(resolve, milliseconds);
		});
	};

	/**
	 * Delays code execution in an async function for the specified time.
	 *
	 * If no input is given, it waits until after a physics update is completed.
	 *
	 * @param {Number} millisecond
	 * @returns {Promise} A Promise that fulfills after the specified time.
	 *
	 * @example
	 * async function startGame() {
	 *   await sleep(3000);
	 * }
	 */
	this.sleep = (milliseconds) => {
		if (!milliseconds) {
			return new Promise((resolve) => {
				if ($.canvas.dispatchEvent) {
					function handler() {
						$.canvas.removeEventListener('p5play_worldStepped', handler);
						resolve();
					}
					$.canvas.addEventListener('p5play_worldStepped', handler);
				} else {
					setTimeout(resolve, $.world._timeStep * 1000);
				}
			});
		}
		return $.delay(milliseconds);
	};

	/**
	 * Awaitable function for playing sounds.
	 *
	 * @param {any} sound
	 * @returns {Promise}
	 * @example
	 * await play(sound);
	 */
	this.play = (sound) => {
		if (!sound?.play) {
			throw new Error("Tried to play your sound but it wasn't a sound object.");
		}
		return new Promise((resolve) => {
			sound.play();
			sound.onended(() => resolve());
		});
	};

	async function playIntro() {
		if (document.getElementById('p5play-intro')) return;
		$._incrementPreload();
		let d = document.createElement('div');
		d.id = 'p5play-intro';
		d.style = 'position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1000; background-color: black;';
		let logo = document.createElement('img');
		logo.style = `position: absolute; top: 50%; left: 50%; width: 80vmin; height: 40vmin; margin-left: -40vmin; margin-top: -20vmin; z-index: 1001; opacity: 1; scale: 1; transition: scale 1.5s, opacity 0.4s ease-in-out;`;
		logo.onerror = () => {
			logo.style.imageRendering = 'pixelated';
			logo.src =
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAABbGlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAACiRfZC/S0JhGIWfm4VgNkQNDg13igYr0SCXBjWQIkisQG26Xn+C2sfVCKMtWkPoP8igOWgoIgxaGhqCqCGitqamgpaSL+69hS51lvfhcDgcXujxaEKUeoFypWbEo2E1kUypzhcUFCxpelWEYrEFk39vlxT4uLezt+Nm12u7uRvciV6Wj88XNx88k/wvVyZb1YEvwKcLowaKF4ht1ITJW8CwkUimQGmYnLf5wOS0zSdWZjkeAeUaUPWClgHlFfCmu/x8F5dL6/rPMnO9O1tZWTJ7gBFmKVJFUEKjjkqMwB/5KSsfYQ1BHYMieQrUUAkhrIYsKnNU0JnAi4ofH3785p/tuo+7n/95O972M8y0pJRnHW++BUfT4DrteGNBGOyHq1OhGZplOYCeXA7eDmEgCUM34Fqt5gJ+e707DH1PUr6PgnMP2g0pP/elbDfB8QgXlW8Y/mq9pjC8gwAABSxJREFUeJztnb9y2zAMxulcpnbNntfJ3D5n97xO966Z3aNP9NHgBxAgQVmO8bvLNZZIiCI+gH8kpyl4bk7P3gErOJ/PZ0+zp9NpmZ9CAM54O7+wSgQhAEdWOb+wQgSvzZHAj5+/50x9/WkOeRMZwIkm+medXyAi8M4CL82R4KkIATjQRL8nJJN4XysEsAKv9L8DIYAnJyaBk8CUTDLA51/bbP7jHWSQRZPByADeTDp/tM4ozT4AVHSwO1kEMBMY/dTLFNcMcN5oSgTHYHBi2fPrS4qo98Mh/a+C8/ErdyJYw8cbb/bzH/ncGQY8aOYAnpThZ4XGerZdrn209fxIe6rVQw52Oif4NquAfF+d+Y6NSeej9C9F/714WAHkyP5uoxcSCBKSic5WMhwCciTlcnUaRSmVRlw5x0UiVx6VqW1Ru1zbaHl6TXS9Efae3GmuNzpXYDMA7VT6OxKE9nhPKNy1ZlHbEdL/qPNRdHsy2i5WAIk41yt6emM1Jw5OcL12eg4VR1rWmRCGAVEAGjhncseLQ7SOebZV6t4TxWEBcFHHOayO7PoHUcpy/y5FSP+jWJ06KoKRDAUngZxDUXrVlOsdR0jX8vjsxaqI1dilG0ciWdjgHcN4GqgERdcR1/VayjwgBFDzQG/yJEaASKgSIYBnAgg8BKAARRWKvkcjDwMhgAKIjkcACREJlgOuAu5K7Qgwaz0KeQaOOn9vTCsBwLwApMiZdOBROpnj3u2bdX5aPQfwaOBuDIr1HveYryldl30wBO4RZ4AS1aXCbFr2skezTa5b2+7Z7Z2nNjZKh3Jja3HGHtlAcnwyOj+/HIIFUACd0TizbhzTQU1ddAzYg+WYY5d0TM5dXql6A2VzO7n0jUS6kTtXuseVQ4Im01icXxgfApgOuvy8pevPjD3VuRrhRpu29trG2GI7eWPFkKCJerZdzH2UV8NUAsiqR8pnG5YdJjjNZA+8aYvqIq6dQqNfC9N5YofvDNuO3HbQ/tNG+dwVQOmwS8QAg/kY26lABF17Aqq65DgSlSkzMR2ZpM53hmsve32mvehLIvIcoFyIaUB9vhZB3bBmbJ6cLJkfrb4PRj+FmSAeCsbxiXF+0mSAG5WhDtjSfT32S3TtUb6wsMS6Qkd4TtKQoI62b0FTPkW3EQQ6G908KgcB5aA9BKir4WFf59q4ZNneF0eYZ/4SUxtB4lg88rVoLnqEa7CAOqz9J0Y9Caw/N44FnX0zYQPHRXsI4RqQ0Zk/B1iNUB5RYKohgN4svNG8GiApCpbr2QN2uHN08nmBGSK4ttyLkd1D1TBgxGUV4F1OOk/PSWUTENsRqJ3ovo1M5gHo+4A13/YPRd4sS2c7V/m1795WMJvZlNvIUv1RTtzXw2mqncXbnsSSqCJwIuCua3GetX4zBBj+ntDlBCeCYGNg2Vo7UXIeR6nv9fSPE0EIoAdwfs095xis85NeAC/SyWDSCQLXJ6cT9T2Ajo+MQOhkgWTMBMh55iecPSxDQHBLEwCG7WfJkd13CYS6mvpXrJPAoKURQdILATnSkrKbjTJLugc7piGAQWZEkDS7dMIj5utWulQf2SNIzk8hgD6zIoBQRy36n0U0k/sQgAIogjT/Z9saHO1pV3YhACUuImCcNWRPsGVZ1ocAjEAh9JwmOAsyaG9kPycEMAAUQWIcp3CWt71gB84SP34JJ7Gzm0I1A/a0hGomsTigF6VWZ3pEfQjAAY3jLM7yticRAnAEOW7GUd72ECEAZ2qneTjL294NKaX/gKttC9Kft4MAAAAASUVORK5CYII=';
		};
		let src = window._p5play_intro_image;
		if (src == '' || src?.includes('made_with_p5play')) {
			if (src.includes('bit.') || src.includes('pixel')) {
				logo.style.imageRendering = 'pixelated';
			}
			logo.src = src;
		} else {
			logo.src = 'https://p5play.org/assets/made_with_p5play.webp';
		}
		await new Promise((r) => (logo.onload = r));
		d.append(logo);
		document.body.append(d);
		await $.delay();
		logo.offsetHeight; // trigger css reflow
		logo.style.scale = 1.2;
		await $.delay(1100);
		logo.style.opacity = 0;
		await $.delay(400);
		d.style.display = 'none';
		d.remove();
		document.getElementById('p5play-intro')?.remove();
		$._decrementPreload();
	}

	if (window.location) {
		let lh = location.hostname;
		switch (lh) {
			case '':
			case '127.0.0.1':
			case 'localhost':
			case 'p5play.org':
			case 'editor.p5js.org':
			case 'codepen.io':
			case 'codera.app':
			case 'aug4th.com':
			case 'cdpn.io':
			case 'glitch.com':
			case 'replit.com':
			case 'stackblitz.com':
			case 'jsfiddle.net':
			case 'aijs.io':
			case 'preview-aijs.web.app':
			case 'quinton-ashley.github.io':
				break;
			default:
				if (
					/^[\d\.]+$/.test(lh) ||
					lh.endsWith('.lan') ||
					lh.endsWith('stackblitz.io') ||
					lh.endsWith('glitch.me') ||
					lh.endsWith('replit.dev') ||
					lh.endsWith('codehs.com') ||
					lh.endsWith('openprocessing.org') ||
					location.origin.endsWith('preview.p5js.org')
				) {
					break;
				}
				playIntro();
		}
	}

	let userDisabledP5Errors = p5.disableFriendlyErrors;
	p5.disableFriendlyErrors = true;

	const _createCanvas = $.createCanvas;

	/**
	 * Use of `new Canvas()` is preferred. Check the Canvas constructor
	 * for documentation.
	 *
	 * @returns {Canvas} renderer object
	 */
	this.createCanvas = function () {
		let args = [...arguments];
		let displayMode, renderQuality, displayScale;
		if (typeof args[0] == 'string') {
			if (args[0].includes(':')) {
				let ratio = args[0].split(':');
				let rW = Number(ratio[0]);
				let rH = Number(ratio[1]);
				let w = window.innerWidth;
				let h = window.innerWidth * (rH / rW);
				if (h > window.innerHeight) {
					w = window.innerHeight * (rW / rH);
					h = window.innerHeight;
				}
				args[0] = Math.round(w);
				args.splice(1, 0, Math.round(h));
				displayMode = 'fullscreen';
			} else {
				args = [0, 0, ...args];
			}
		}
		if (!args[0]) {
			args[0] = window.innerWidth;
			args[1] = window.innerHeight;
			displayMode = 'fullscreen';
		}
		if (typeof args[2] == 'string') {
			let rend = args[2].toLowerCase().split(' ');
			if (rend[0] == 'pixelated') {
				renderQuality = 'pixelated';
				if (!rend[1]) displayMode = 'fullscreen';
				else {
					displayMode = 'centered';
					displayScale = Number(rend[1].slice(1));
				}
				args.splice(2, 1);
			} else if (rend[0] == 'fullscreen') {
				displayMode = 'fullscreen';
				args.splice(2, 1);
			}
		}
		let rend = _createCanvas.call($, ...args);
		$.ctx = $.drawingContext;
		let c = rend.canvas || rend;
		if (rend.GL) c.renderer = 'webgl';
		else if (c.renderer != 'webgpu') c.renderer = 'c2d';
		c.tabIndex = 0;
		c.w = args[0];
		c.h = args[1];
		if (c.addEventListener) {
			c.addEventListener('keydown', function (e) {
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
			c.addEventListener('mouseover', () => {
				this.mouse.isOnCanvas = true;
				this.mouse.isActive = true;
			});
			c.addEventListener('mouseleave', () => {
				this.mouse.isOnCanvas = false;
			});
			c.addEventListener('touchstart', (e) => e.preventDefault());
			// this stops the right click menu from appearing
			c.addEventListener('contextmenu', (e) => e.preventDefault());
		}
		c.save ??= $.saveCanvas.bind($);
		c.resize ??= $.resizeCanvas.bind($);
		c.hw = c.w * 0.5;
		c.hh = c.h * 0.5;
		c.mouse = { x: $.mouseX, y: $.mouseY };
		if (c.renderer == 'c2d' && !$._webgpuFallback) {
			$.camera.x = $.camera.ogX = c.hw;
			$.camera.y = $.camera.ogY = c.hh;
		} else {
			$.camera.x = 0;
			$.camera.y = 0;
			if (c.renderer == 'webgl') $._textCache = false;
			if (!$._webgpuFallback) {
				$.p5play._renderStats = {
					x: -c.hw + 10,
					y: -c.hh + 20
				};
			}
		}
		if (!userDisabledP5Errors) p5.disableFriendlyErrors = false;

		$.displayMode(displayMode, renderQuality, displayScale);

		return rend;
	};

	// this is only for jsdoc
	/**
	 * @class
	 */
	this.Canvas = class {
		/**
		 * p5play adds some extra functionality to the `createCanvas`
		 * function. See the examples below.
		 *
		 * Creating a canvas in p5play disables the browser's default
		 * keydown responses for the slash, space, and arrow keys to
		 * prevent page scrolling which is disruptive to gameplay.
		 *
		 * For an easy way to scale the canvas or make it pixelated, use
		 * the `displayMode` function.
		 *
		 * Only q5.js has support for canvas options.
		 *
		 * @param {Number} [width]
		 * @param {Number} [height]
		 * @param {Object} [options] - canvas options or renderer
		 * @returns HTML5 canvas element
		 * @example
		 * // fills the window
		 * new Canvas();
		 * // max 16:9 aspect ratio dimensions that will fit the window
		 * new Canvas('16:9');
		 * // 800x600 pixels
		 * new Canvas(800, 600);
		 */
		constructor(width, height, options) {
			/**
			 * The width of the canvas.
			 * @type {Number}
			 * @default 100
			 */
			this.w;
			/**
			 * The width of the canvas.
			 * @type {Number}
			 * @default 100
			 */
			this.width;
			/**
			 * The height of the canvas.
			 * @type {Number}
			 * @default 100
			 */
			this.h;
			/**
			 * The height of the canvas.
			 * @type {Number}
			 * @default 100
			 */
			this.height;
			/**
			 * Half the width of the canvas.
			 * @type {Number}
			 * @default 50
			 */
			this.hw;
			/**
			 * Half the height of the canvas.
			 * @type {Number}
			 * @default 50
			 */
			this.hh;
			/**
			 * Absolute position of the mouse on the canvas, not relative
			 * to the camera. Same values as `mouseX` and `mouseY`.
			 * @type {Object}
			 * @property {Number} x
			 * @property {Number} y
			 */
			this.mouse;
		}

		/**
		 * Resizes the canvas, the world, and centers the camera.
		 *
		 * Visually the canvas will shrink or extend to the new size. Sprites
		 * will not change position.
		 *
		 * If you would prefer to keep the camera focused on the same area,
		 * then you must manually adjust the camera position after calling
		 * this function.
		 *
		 * @param {Number} w - the new width of the canvas
		 * @param {Number} h - the new height of the canvas
		 */
		resize() {}

		/**
		 * Saves the current canvas as an image file.
		 * @param {String} file - the name of the image
		 */
		save() {}
	};

	/**
	 * HTML5 canvas element.
	 * @type {Canvas}
	 */
	this.canvas = $.canvas;

	$.Canvas = function () {
		return $.createCanvas(...arguments).canvas;
	};

	const _resizeCanvas = $.resizeCanvas;

	/**
	 * Use of `canvas.resize()` is preferred.
	 */
	this.resizeCanvas = (w, h) => {
		w ??= window.innerWidth;
		h ??= window.innerHeight;
		_resizeCanvas.call($, w, h);
		let c = $.canvas;
		c.w = c.width / $.pixelDensity();
		c.h = c.height / $.pixelDensity();
		c.hw = c.w * 0.5;
		c.hh = c.h * 0.5;
		if (c.fullscreen) {
			if (c.w / c.h > window.innerWidth / window.innerHeight) {
				c.style.width = '100%!important';
				c.style.height = 'auto!important';
			} else {
				c.style.width = 'auto!important';
				c.style.height = '100%!important';
			}
		}
		if (c.renderer == 'c2d') {
			$.camera.x = c.hw;
			$.camera.y = c.hh;
		} else {
			$.camera.x = 0;
			$.camera.y = 0;
		}
	};

	const _frameRate = $.frameRate;

	this.frameRate = function (hz) {
		let ret = _frameRate.call($, hz);
		if (hz) $.world._setTimeStep();
		return ret;
	};

	const _background = $.background;

	/**
	 * Covers the canvas with a color or image.
	 * In p5play it can also accept a color palette code.
	 */
	this.background = function () {
		let args = arguments;
		if (args.length == 1 && args[0]?.length == 1) {
			_background.call($, $.colorPal(args[0]));
		} else _background.call($, ...args);
	};

	const _fill = $.fill;

	/**
	 * Sets the color used to fill shapes.
	 * In p5play it can also accept a color palette code.
	 */
	this.fill = function () {
		let args = arguments;
		if (args.length == 1 && args[0]?.length == 1) {
			_fill.call($, $.colorPal(args[0]));
		} else _fill.call($, ...args);
	};

	const _stroke = $.stroke;

	/**
	 * Sets the color used to stroke an outline around a shape.
	 * In p5play it can also accept a color palette code.
	 */
	this.stroke = function () {
		let args = arguments;
		if (args.length == 1 && args[0]?.length == 1) {
			_stroke.call($, $.colorPal(args[0]));
		} else _stroke.call($, ...args);
	};

	const _loadImage = $.loadImage;

	/**
	 * Loads an image. p5play caches images so that they're only
	 * loaded once, so multiple calls to `loadImage` with the same
	 * path will return the same image object. p5play also adds the
	 * image's url as a property of the image object.
	 *
	 * @param {string} url
	 * @param {number} [width]
	 * @param {number} [height]
	 * @param {function} [callback]
	 * @returns {Image}
	 */
	this.loadImage = this.loadImg = function () {
		if ($.p5play.disableImages) {
			$._decrementPreload();
			// return a dummy image object to prevent errors
			return { w: 16, width: 16, h: 16, height: 16, pixels: [] };
		}
		let args = arguments;
		let url = args[0];
		let img = $.p5play.images[url];
		let cb;
		if (typeof args[args.length - 1] == 'function') {
			cb = args[args.length - 1];
		}
		if (img) {
			// if not finished loading, add callback to the list
			if (img.width <= 1 && img.height <= 1) {
				if (cb) {
					img.cbs.push(cb);
					img.calls++;
				} else if (!$._q5) $._decrementPreload();
			} else {
				if (cb) cb(); // if already loaded, run the callback immediately
				if (!$._q5) $._decrementPreload();
			}
			return img;
		}
		const _cb = (_img) => {
			// in q5 these getters are already defined
			if (!_img.w) {
				Object.defineProperty(_img, 'w', {
					get: function () {
						return this.width;
					}
				});
				Object.defineProperty(_img, 'h', {
					get: function () {
						return this.height;
					}
				});
			}

			// server side use of p5play makes images load synchronously
			if (_img.cbs) {
				for (let cb of _img.cbs) {
					cb(_img);
				}
				if (!$._q5) {
					for (let i = 1; i < _img.calls; i++) {
						$._decrementPreload();
					}
				}
				_img.cbs = [];
			}

			$.p5play.onImageLoad(img);
		};
		img = _loadImage.call($, url, _cb);
		img.cbs = [];
		img.calls = 1;
		if (cb) img.cbs.push(cb);
		img.url = url;
		$.p5play.images[url] = img;
		return img;
	};

	const _image = $.image;

	/**
	 * Display an image
	 * unless `p5play.disableImages` is true.
	 * @param {Image} img
	 */
	$.image = function () {
		if ($.p5play.disableImages) return;
		_image.call($, ...arguments);
	};

	// if the user isn't using q5.js
	// add a backwards compatibility layer for p5.js
	if (!$.displayMode && typeof document == 'object') {
		document.head.insertAdjacentHTML(
			'beforeend',
			`<style>
html, body {
	margin: 0;
	padding: 0;
}
body.hasFrameBorder {
	display: block;
}
.p5Canvas {
	outline: none;
	-webkit-touch-callout: none;
	-webkit-text-size-adjust: none;
	-webkit-user-select: none;
	overscroll-behavior: none;
}
.p5-pixelated {
	image-rendering: pixelated;
	font-smooth: never;
	-webkit-font-smoothing: none;
}
.p5-centered,
.p5-maxed,
.p5-fullscreen {
  display: flex;
	align-items: center;
	justify-content: center;
}
main.p5-centered,
main.p5-maxed,
.p5-fullscreen {
	height: 100vh;
}
main {
	overscroll-behavior: none;
}
</style>`
		);

		$._adjustDisplay = () => {
			let c = $.canvas;

			let s = c.style;
			let p = c.parentElement;
			if (!s || !p || !c.displayMode) return;
			if (c.renderQuality == 'pixelated') {
				c.classList.add('p5-pixelated');
				$.pixelDensity(1);
				if ($.noSmooth) $.noSmooth();
				if ($.textFont) $.textFont('monospace');
			}
			if (c.displayMode == 'normal') {
				p.classList.remove('p5-centered', 'p5-maxed', 'p5-fullscreen');
				s.width = c.w * c.displayScale + 'px';
				s.height = c.h * c.displayScale + 'px';
			} else {
				p.classList.add('p5-' + c.displayMode);
				p = p.getBoundingClientRect();
				if (c.w / c.h > p.width / p.height) {
					if (c.displayMode == 'centered') {
						s.width = c.w * c.displayScale + 'px';
						s.maxWidth = '100%';
					} else s.width = '100%';
					s.height = 'auto';
					s.maxHeight = '';
				} else {
					s.width = 'auto';
					s.maxWidth = '';
					if (c.displayMode == 'centered') {
						s.height = c.h * c.displayScale + 'px';
						s.maxHeight = '100%';
					} else s.height = '100%';
				}
			}
		};

		/** 💻
		 * The `displayMode` function lets you customize how your canvas is presented.
		 *
		 * Display modes:
		 * - "normal": no styling to canvas or its parent element
		 * - "centered": canvas will be centered horizontally and vertically within its parent and if it's display size is bigger than its parent it will not clip
		 * - "maxed": canvas will fill the parent element, same as fullscreen for a global mode canvas inside a `main` element
		 * - "fullscreen": canvas will fill the screen with letterboxing if necessary to preserve its aspect ratio, like css object-fit contain
		 *
		 * Render qualities:
		 * - "default": pixelDensity set to displayDensity
		 * - "pixelated": pixelDensity set to 1 and various css styles are applied to the canvas to make it render without image smoothing
		 *
		 * Display scale can be set to make small canvases appear larger.
		 * @param displayMode
		 * @param renderQuality
		 * @param displayScale - can be given as a string (ex. "x2") or a number
		 */
		$.displayMode = (displayMode = 'normal', renderQuality = 'default', displayScale = 1) => {
			let c = $.canvas;

			if (typeof displayScale == 'string') {
				displayScale = parseFloat(displayScale.slice(1));
			}
			Object.assign(c, { displayMode, renderQuality, displayScale });
			$._adjustDisplay();
		};
	}

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
				1: "If you're trying to specify points for a chain Sprite, please use an array of position arrays.\n$0",
				2: 'Invalid input parameters: $0'
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
			rotateMinTo: {},
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
		Ani: {
			constructor: {
				base: "Hey so, I tried to make a new Ani but couldn't",
				1: 'The name of the animation must be the first input parameter.'
			},
			frame: 'Index $0 out of bounds. That means there is no frame $0 in this animation. It only has $1 frames!'
		},
		Group: {
			constructor: {
				base: "Hmm awkward! Well it seems I can't make that new Group you wanted"
			}
		}
	};
	errMsgs.Group.collide = errMsgs.Sprite.collide;
	errMsgs.Group.overlap = errMsgs.Sprite.overlap;
	errMsgs.Sprite.rotateTo[0] =
		errMsgs.Sprite.rotateMinTo[0] =
		errMsgs.Sprite.rotateTowards[0] =
			errMsgs.Sprite.rotate[0];

	/**
	 * A FriendlyError is a custom error class that extends the native JS
	 * Error class. It's used internally by p5play to make error messages
	 * more helpful.
	 *
	 * @private
	 * @param {String} func - the name of the function the error was thrown in
	 * @param {Number} errorNum - the error's code number
	 * @param {Array} e - an array of values relevant to the error
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
			if (m) {
				m = m.replace(/\$([0-9]+)/g, (m, n) => {
					return e[n];
				});
				msg += m;
			}

			p5._friendlyError(msg, func);
		}
	}

	/**
	 * A group that includes all the sprites.
	 * @type {Group}
	 */
	this.allSprites = new $.Group();

	/**
	 * The physics world.
	 * @type {World}
	 */
	this.world = new $.World();

	/**
	 * The default camera.
	 * @type {Camera}
	 */
	this.camera = new $.Camera();

	/**
	 * @class
	 */
	this.InputDevice = class {
		/**
		 * <a href="https://p5play.org/learn/input.html">
		 * Look at the Input reference pages before reading these docs.
		 * </a>
		 *
		 * Root class for storing the state of inputs (mouse, keyboard,
		 * gamepads).
		 *
		 * -3 means input was pressed and released on the same frame
		 * -2 means input was released after being held
		 * -1 means input was released
		 * 0 means input is not pressed
		 * 1 means input was pressed
		 * >1 means input is still being pressed
		 */
		constructor() {
			/**
			 * The amount of frames an input must be pressed to be considered held.
			 * @type {number}
			 * @default 12
			 */
			this.holdThreshold = 12;

			this._default = 0;
		}

		/*
		 * Attempt to auto-correct the user's input. Inheriting classes
		 * override this method.
		 */
		_ac(inp) {
			return inp;
		}

		/**
		 * @param {string} inp
		 * @returns {boolean} true on the first frame that the user presses the input
		 */
		presses(inp) {
			inp ??= this._default;
			if (this[inp] === undefined) inp = this._ac(inp);
			return this[inp] == 1 || this[inp] == -3;
		}

		/**
		 * @param {string} inp
		 * @returns {number} the amount of frames the user has been pressing the input
		 */
		pressing(inp) {
			inp ??= this._default;
			if (this[inp] === undefined) inp = this._ac(inp);
			if (this[inp] == -3) return 1;
			return this[inp] > 0 ? this[inp] : 0;
		}

		/**
		 * Same as the `released` function, which is preferred.
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
			inp ??= this._default;
			if (this[inp] === undefined) inp = this._ac(inp);
			return this[inp] == this.holdThreshold;
		}

		/**
		 * @param {string} inp
		 * @returns {number} the amount of frames the user has been holding the input
		 */
		holding(inp) {
			inp ??= this._default;
			if (this[inp] === undefined) inp = this._ac(inp);
			return this[inp] >= this.holdThreshold ? this[inp] : 0;
		}

		/**
		 * @param {string} inp
		 * @returns {boolean} true on the first frame that the user released a held input
		 */
		held(inp) {
			inp ??= this._default;
			if (this[inp] === undefined) inp = this._ac(inp);
			return this[inp] == -2;
		}

		/**
		 * @param {string} inp
		 * @returns {boolean} true on the first frame that the user released the input
		 */
		released(inp) {
			inp ??= this._default;
			if (this[inp] === undefined) inp = this._ac(inp);
			return this[inp] <= -1;
		}

		releases(inp) {
			return this.released(inp);
		}
	};

	/**
	 * @class
	 * @extends InputDevice
	 */
	this._Mouse = class extends $.InputDevice {
		/**
		 * <a href="https://p5play.org/learn/input.html">
		 * Look at the Input reference pages before reading these docs.
		 * </a>
		 *
		 * Used to create the `mouse` input object.
		 */
		constructor() {
			super();
			this._default = 'left';

			let _this = this;

			// this.x and this.y store the actual position values of the mouse
			this._pos = $.createVector.call($);

			Object.defineProperty(this._pos, 'x', {
				get() {
					return _this.x;
				},
				set(val) {
					_this.x = val;
				}
			});

			Object.defineProperty(this._pos, 'y', {
				get() {
					return _this.y;
				},
				set(val) {
					_this.y = val;
				}
			});

			/**
			 * The mouse's x position in the world.
			 * @type {Number}
			 */
			this.x = 0;
			/**
			 * The mouse's y position in the world.
			 * @type {Number}
			 */
			this.y = 0;
			/**
			 * The mouse's absolute position on the canvas.
			 * @type {object}
			 * @property {Number} x
			 * @property {Number} y
			 */
			this.canvasPos = {};
			/**
			 * The mouse's left button.
			 * @type {Number}
			 */
			this.left = 0;
			/**
			 * The mouse's center button.
			 * @type {Number}
			 */
			this.center = 0;
			/**
			 * The mouse's right button.
			 * @type {Number}
			 */
			this.right = 0;

			/**
			 * Contains the drag status of each of the mouse's buttons.
			 * @type {object}
			 */
			this.drag = {
				left: 0,
				center: 0,
				right: 0
			};
			this._dragFrame = {
				left: false,
				center: false,
				right: false
			};
			/**
			 * True if the mouse is currently on the canvas.
			 * @type {boolean}
			 * @default false
			 */
			this.isOnCanvas = false;
			/**
			 * True if the mouse has ever interacted with the canvas.
			 * @type {boolean}
			 * @default false
			 */
			this.isActive = false;

			this._visible = true;
			this._cursor = 'default';
			this._ogX = 0;
			this._ogY = 0;
		}

		_ac(inp) {
			inp = inp.toLowerCase();
			if (inp.slice(0, 4) == 'left') inp = 'left';
			else if (inp.slice(0, 5) == 'right') inp = 'right';
			else if (inp.slice(0, 6) == 'middle') inp = 'center';
			return inp;
		}

		_update() {
			$.mouse.canvasPos.x = $.mouseX;
			$.mouse.canvasPos.y = $.mouseY;

			if ($.camera.x == $.camera.ogX && $.camera.y == $.camera.ogY && $.camera.zoom == 1) {
				this.x = $.mouseX;
				this.y = $.mouseY;
			} else if ($.canvas.renderer != 'webgpu') {
				this.x = ($.mouseX - $.canvas.hw) / $.camera.zoom + $.camera.x;
				this.y = ($.mouseY - $.canvas.hh) / $.camera.zoom + $.camera.y;
			} else {
				this.x = $.mouseX / $.camera.zoom + $.camera.x;
				this.y = $.mouseY / $.camera.zoom + $.camera.y;
			}
		}

		/**
		 * The mouse's position.
		 * @type {object}
		 */
		get pos() {
			return this._pos;
		}
		/**
		 * The mouse's position. Alias for pos.
		 * @type {object}
		 */
		get position() {
			return this._pos;
		}

		/**
		 * The mouse's CSS cursor style.
		 * @type {string}
		 * @default 'default'
		 */
		get cursor() {
			return $.canvas.style.cursor;
		}
		set cursor(val) {
			if (val != this._cursor) {
				$.cursor(val);
				this._cursor = val;
			}
		}

		/**
		 * Controls whether the mouse is visible or not.
		 * @type {boolean}
		 * @default true
		 */
		get visible() {
			return this._visible;
		}
		set visible(val) {
			this._visible = val;
			if (val) $.canvas.style.cursor = 'default';
			else $.canvas.style.cursor = 'none';
		}

		/**
		 * @param {string} inp
		 * @returns {boolean} true on the first frame that the user moves the mouse while pressing the input
		 */
		drags(inp) {
			inp ??= this._default;
			return this.drag[inp] == 1;
		}

		/**
		 * @param {string} inp
		 * @returns {number} the amount of frames the user has been moving the mouse while pressing the input
		 */
		dragging(inp) {
			inp ??= this._default;
			return this.drag[inp] > 0 ? this.drag[inp] : 0;
		}

		/**
		 * @param {string} inp
		 * @returns {boolean} true on the first frame that the user releases the input after dragging the mouse
		 */
		dragged(inp) {
			inp ??= this._default;
			return this.drag[inp] <= -1;
		}
	};

	/**
	 * Get user input from the mouse.
	 * Stores the state of the left, center, or right mouse buttons.
	 * @type {_Mouse}
	 */
	this.mouse = new $._Mouse();

	/**
	 * @class
	 * @extends _Mouse
	 */
	this._SpriteMouse = class extends $._Mouse {
		/**
		 * <a href="https://p5play.org/learn/input.html">
		 * Look at the Input reference pages before reading these docs.
		 * </a>
		 *
		 * Used to create `sprite.mouse` input objects.
		 */
		constructor() {
			super();
			delete this.canvasPos;
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
			return this.hover <= -1;
		}
	};

	const __onmousedown = function (btn) {
		$.mouse.isActive = true;
		$.mouse[btn]++;
		if ($.world.mouseSprites.length) {
			let msm = $.world.mouseSprite?.mouse;
			// old mouse sprite didn't have the mouse released on it
			if (msm) {
				msm[btn] = 0;
				msm.hover = 0;
				msm.drag[btn] = 0;
			}
			ms = $.world.mouseSprites[0];
			$.world.mouseSprite = ms;
			msm = ms.mouse;
			msm[btn] = 1;
			if (msm.hover <= 0) msm.hover = 1;
		}
	};

	const _onmousedown = $._onmousedown;

	$._onmousedown = function (e) {
		if (!$._setupDone) return;

		let btn = 'left';
		if (e.button === 1) btn = 'center';
		else if (e.button === 2) btn = 'right';

		__onmousedown.call($, btn);
		_onmousedown.call($, e);
	};

	const __onmousemove = function (btn) {
		let m = $.mouse;
		if (m[btn] > 0) m._dragFrame[btn] = true;
	};

	const _onmousemove = $._onmousemove;

	$._onmousemove = function (e) {
		if (!$._setupDone) return;

		let btn = 'left';
		if (e.button === 1) btn = 'center';
		else if (e.button === 2) btn = 'right';

		__onmousemove.call($, btn);
		_onmousemove.call($, e);
	};

	const __onmouseup = function (btn) {
		let m = $.mouse;
		if (m[btn] >= m.holdThreshold) m[btn] = -2;
		else if (m[btn] > 1) m[btn] = -1;
		else m[btn] = -3;

		if (m.drag[btn] > 0) m.drag[btn] = -1;

		let msm = $.world.mouseSprite?.mouse;
		if (!msm) return;

		if (msm.hover > 1) {
			if (msm[btn] >= $.mouse.holdThreshold) msm[btn] = -2;
			else if (msm[btn] > 1) msm[btn] = -1;
			else msm[btn] = -3;

			if (msm.drag[btn] > 0) msm.drag[btn] = -1;
		} else {
			msm[btn] = 0;
			msm.drag[btn] = 0;
		}
	};

	const _onmouseup = $._onmouseup;

	$._onmouseup = function (e) {
		if (!$._setupDone) return;

		let btn = 'left';
		if (e.button === 1) btn = 'center';
		else if (e.button === 2) btn = 'right';

		__onmouseup.call($, btn);
		_onmouseup.call($, e);
	};

	/**
	 * @class
	 * @extends InputDevice
	 */
	this._Touch = class extends $.InputDevice {
		/**
		 * <a href="https://p5play.org/learn/input.html">
		 * Look at the Input reference pages before reading these docs.
		 * </a>
		 *
		 * Used internally to create touch input objects in the `touches` array.
		 */
		constructor(touch) {
			super();
			/**
			 * The touch's x position in the world.
			 * @type {Number}
			 */
			this.x;
			/**
			 * The touch's y position in the world.
			 * @type {Number}
			 */
			this.y;
			/**
			 * The touch's unique identifier.
			 * @type {Number}
			 */
			this.id = touch.identifier;
			this._default = 'duration';
			/**
			 * The amount of frames a touch must be pressed to be
			 * considered held.
			 * @type {Number}
			 * @default 12
			 */
			this.holdThreshold = $.touches.holdThreshold;
			/**
			 * The amount of frames the user has been touching the screen.
			 * @type {Number}
			 */
			this.duration = 1;
			/**
			 * The amount of frames the user has been dragging on the screen.
			 * @type {Number}
			 */
			this.drag = 0;
			this._dragFrame = false;
			/**
			 * The touch's absolute position on the canvas.
			 * @type {Object}
			 * @property {Number} x
			 * @property {Number} y
			 */
			this.canvasPos = {};
			this._update(touch);
		}

		_update(v) {
			let c = $.canvas;
			const rect = c.getBoundingClientRect();
			const sx = c.scrollWidth / c.w || 1;
			const sy = c.scrollHeight / c.h || 1;
			const x = (this.canvasPos.x = (v.clientX - rect.left) / sx);
			const y = (this.canvasPos.y = (v.clientY - rect.top) / sy);
			if ($.camera.x == c.hw && $.camera.y == c.hh && $.camera.zoom == 1) {
				this.x = x;
				this.y = y;
			} else {
				this.x = (x - c.hw) / $.camera.zoom + $.camera.x;
				this.y = (y - c.hh) / $.camera.zoom + $.camera.y;
			}
			this.force = v.force;
		}
	};

	$.touches = [];
	$.touches.holdThreshold = 12;

	$._ontouchstart = function (e) {
		if (!$._setupDone) return;

		if ($.getAudioContext && $.getAudioContext()?.state == 'suspended') $.userStartAudio();

		for (let touch of e.changedTouches) {
			$.touches.push(new $._Touch(touch));

			if ($.touches.length == 1) {
				$.mouseX = $.touches[0].x;
				$.mouseY = $.touches[0].y;
				$.mouse._update();
				$.world.mouseSprites = $.world.getMouseSprites();
				$._onmousedown(e);
			}
		}
		if ($.touchStarted && !$.touchStarted(e)) e.preventDefault();
	};

	$._ontouchmove = function (e) {
		if (!$._setupDone) return;

		for (let touch of e.changedTouches) {
			let t = $.touches.find((t) => t.id == touch.identifier);
			t._update(touch);
			t._dragFrame = true;
			if (t.id == $.touches[0].id) {
				$.mouseX = $.touches[0].x;
				$.mouseY = $.touches[0].y;
				$.mouse._update();
				$._onmousemove(e);
			}
		}
		if ($.touchMoved && !$.touchMoved(e)) e.preventDefault();
	};

	$._ontouchend = function (e) {
		if (!$._setupDone) return;

		for (let touch of e.changedTouches) {
			let t = $.touches.find((t) => t.id == touch.identifier);
			t._update(touch);

			if (t.duration >= t.holdThreshold) t.duration = -2;
			else if (t.duration > 1) t.duration = -1;
			else t.duration = -3;

			if (t.drag > 0) t.drag = -1;

			if (t.id == $.touches[0].id) {
				$.mouseX = $.touches[0].x;
				$.mouseY = $.touches[0].y;
				$.mouse._update();
				$._onmouseup(e);
			}
		}
		if ($.touchEnded && !$.touchEnded(e)) e.preventDefault();
	};

	/**
	 * @class
	 * @extends InputDevice
	 */
	this._Keyboard = class extends $.InputDevice {
		/**
		 * <a href="https://p5play.org/learn/input.html">
		 * Look at the Input reference pages before reading these docs.
		 * </a>
		 *
		 * Used to create the `kb` and `keyboard` objects, which store
		 * the input status of keys on the keyboard.
		 *
		 * Most key properties will be undefined until the key is pressed.
		 */
		constructor() {
			super();
			this._default = ' ';

			this.alt = 0;
			this.arrowUp = 0;
			this.arrowDown = 0;
			this.arrowLeft = 0;
			this.arrowRight = 0;
			this.backspace = 0;
			this.capsLock = 0;
			this.control = 0;
			this.enter = 0;
			this.meta = 0;
			this.shift = 0;
			this.tab = 0;

			let k = (this._simpleKeyControls = {
				arrowUp: 'up',
				arrowDown: 'down',
				arrowLeft: 'left',
				arrowRight: 'right'
			});

			k.w = k.W = 'up';
			k.s = k.S = 'down';
			k.a = k.A = 'left';
			k.d = k.D = 'right';

			k.i = k.I = 'up2';
			k.k = k.K = 'down2';
			k.j = k.J = 'left2';
			k.l = k.L = 'right2';
		}

		get visible() {
			return this._inp == document.activeElement;
		}
		set visible(v) {
			if (!this._inp) {
				this._inp = Object.assign(document.createElement('input'), {
					type: 'text',
					style: 'position: fixed; height: 0; padding: 0; border: none; opacity: 0.0001; pointer-events: none;'
				});
				document.body.appendChild(this._inp);
			}
			this._visible = v;
			v ? this._inp.focus() : this._inp.blur();
		}

		_ac(inp) {
			if (inp.length != 1) {
				if (!isNaN(inp)) {
					if (inp == 38) return 'arrowUp';
					if (inp == 40) return 'arrowDown';
					if (inp == 37) return 'arrowLeft';
					if (inp == 39) return 'arrowRight';
					if (inp >= 10) {
						throw new Error('Use key names with the keyboard input functions, not keyCode numbers!');
					}
					return inp;
				}
				inp = inp.replaceAll(/[ _-]/g, '');
			}
			inp = inp.toLowerCase();
			if (inp.length != 1) {
				if (inp == 'arrowup') return 'arrowUp';
				if (inp == 'arrowdown') return 'arrowDown';
				if (inp == 'arrowleft') return 'arrowLeft';
				if (inp == 'arrowright') return 'arrowRight';
				if (inp == 'capslock') return 'capsLock';
			}
			return inp;
		}

		_pre(k) {
			if (!this[k] || this[k] < 0) {
				this[k] = 1;
			}
		}

		_rel(k) {
			if (this[k] >= this.holdThreshold) this[k] = -2;
			else if (this[k] > 1) this[k] = -1;
			else this[k] = -3;
		}

		get cmd() {
			return this['meta'];
		}
		get command() {
			return this['meta'];
		}
		get ctrl() {
			return this['control'];
		}
		get space() {
			return this[' '];
		}
		get spacebar() {
			return this[' '];
		}
		get opt() {
			return this['alt'];
		}
		get option() {
			return this['alt'];
		}
		get win() {
			return this['meta'];
		}
		get windows() {
			return this['meta'];
		}
	};

	/**
	 * Get user input from the keyboard.
	 * @type {_Keyboard}
	 */
	this.kb = new $._Keyboard();

	/**
	 * Alias for kb.
	 * @type {_Keyboard}
	 */
	this.keyboard = $.kb;

	if (typeof navigator == 'object' && navigator.keyboard) {
		const keyboard = navigator.keyboard;
		if (window == window.top) {
			keyboard.getLayoutMap().then((keyboardLayoutMap) => {
				const key = keyboardLayoutMap.get('KeyW');
				if (key != 'w') $.p5play.standardizeKeyboard = true;
			});
		} else {
			$.p5play.standardizeKeyboard = true;
		}
	} else {
		// Firefox and Safari don't have navigator.keyboard
		// so just make them use key codes
		$.p5play.standardizeKeyboard = true;
	}

	function _getKeyFromCode(e) {
		let code = e.code;
		if (code.length == 4 && code.slice(0, 3) == 'Key') {
			return code[3].toLowerCase();
		}
		return e.key;
	}

	const _onkeydown = $._onkeydown;

	$._onkeydown = function (e) {
		let key = e.key;
		if (this.p5play.standardizeKeyboard) {
			key = _getKeyFromCode(e);
		}
		// convert PascalCase key names into camelCase
		// which is more common for JavaScript properties
		if (key.length > 1) {
			key = key[0].toLowerCase() + key.slice(1);
		} else {
			let lower = key.toLowerCase();
			let upper = key.toUpperCase();
			if (lower != upper) {
				if (key != upper) this.kb._pre(upper);
				else this.kb._pre(lower);
			}
		}
		this.kb._pre(key);

		let k = this.kb._simpleKeyControls[key];
		if (k) this.kb._pre(k);

		_onkeydown.call(this, e);
	};

	const _onkeyup = $._onkeyup;

	$._onkeyup = function (e) {
		let key = e.key;
		if (this.p5play.standardizeKeyboard) {
			key = _getKeyFromCode(e);
		}
		if (key.length > 1) {
			key = key[0].toLowerCase() + key.slice(1);
		} else {
			let lower = key.toLowerCase();
			let upper = key.toUpperCase();
			if (lower != upper) {
				if (key != upper) this.kb._rel(upper);
				else this.kb._rel(lower);
			}
		}
		this.kb._rel(key);

		let k = this.kb._simpleKeyControls[key];
		if (k) this.kb._rel(k);

		if (e.shiftKey) {
			// if user is pressing shift but released another key
			let k = key.toLowerCase();
			if (this.kb[k] > 0) this.kb._rel(k);
		}

		_onkeyup.call(this, e);
	};

	/**
	 * @class
	 * @extends InputDevice
	 */
	this.Contro = class extends $.InputDevice {
		/**
		 * <a href="https://p5play.org/learn/input.html">
		 * Look at the Input reference pages before reading these docs.
		 * </a>
		 *
		 * Stores the input status of buttons, triggers, and sticks on
		 * game controllers. Used internally to create controller objects
		 * for the `contros` array (aka `controllers`).
		 *
		 * Can also be used to create a mock controller object.
		 * @param {Gamepad} gamepad - gamepad object or id string for a mock controller
		 */
		constructor(gp) {
			super();
			this._default = 'a';
			this.connected = true;

			this.a = 0;
			this.b = 0;
			this.x = 0;
			this.y = 0;
			this.l = 0;
			this.r = 0;
			this.lt = 0;
			this.rt = 0;
			this.select = 0;
			this.start = 0;
			this.lsb = 0;
			this.rsb = 0;
			this.up = 0;
			this.down = 0;
			this.left = 0;
			this.right = 0;

			/**
			 * Has x and y properties with -1 to 1 values which
			 * represent the position of the left analog stick.
			 *
			 * {x: 0, y: 0} is the center position.
			 * @type {Object}
			 */
			this.leftStick = {
				x: 0,
				y: 0
			};

			/**
			 * Has x and y properties with -1 to 1 values which
			 * represent the position of the right analog stick.
			 *
			 * {x: 0, y: 0} is the center position.
			 * @type {Object}
			 */
			this.rightStick = {
				x: 0,
				y: 0
			};

			/**
			 * Analog value 0-1 of the left trigger.
			 * @default 0
			 */
			this.leftTrigger = 0;
			/**
			 * Analog value 0-1 of the right trigger.
			 * @default 0
			 */
			this.rightTrigger = 0;

			/**
			 * Button names are mapped to `gamepad.buttons` indices.
			 * @type {Object}
			 */
			this.buttonMapping = {
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
				lsb: 10,
				rsb: 11,
				up: 12,
				down: 13,
				left: 14,
				right: 15
			};
			/**
			 * Sticks and triggers are mapped to `gamepad.axes` indices.
			 * @type {Object}
			 */
			this.axeMapping = {
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

			/**
			 * If the controller is a mock controller.
			 * @type {Boolean}
			 */
			this.isMock = false;

			if (typeof gp != 'string') {
				this.gamepad = gp;
				this.id = gp.id;
			} else {
				this.gamepad = {};
				this.id = gp;
				this.isMock = true;
			}

			this._axeTriggers = this.gamepad.axes && this.gamepad.axes[this.axeMapping.leftTrigger] !== undefined;

			/**
			 * True if the controller has analog triggers.
			 * False if the controller has digital (button) triggers.
			 * @type {boolean}
			 */
			this.hasAnalogTriggers = this._axeTriggers || undefined;

			// corrects button mapping for GuliKit KingKong 2 Pro controllers
			// which have a Nintendo Switch style button layout
			// https://www.aliexpress.com/item/1005003624801819.html
			if (this.id.includes('GuliKit')) {
				this.buttonMapping.a = 1;
				this.buttonMapping.b = 0;
				this.buttonMapping.x = 3;
				this.buttonMapping.y = 2;
			}
		}

		_ac(inp) {
			inp = inp.toLowerCase();
			if (inp == 'lb') inp = 'l';
			else if (inp == 'rb') inp = 'r';
			else if (inp == 'leftstickbutton') inp = 'lsb';
			else if (inp == 'rightstickbutton') inp = 'rsb';
			return inp;
		}

		_update() {
			if (this.isMock) return;

			this.gamepad = navigator.getGamepads()[this.gamepad.index];
			if (!this.gamepad?.connected) return;

			let pad = this.gamepad;

			// buttons
			for (let name in this.buttonMapping) {
				let idx = this.buttonMapping[name];
				let b = pad.buttons[idx];
				if (!b) continue;
				if (b.pressed) this[name]++;
				else this[name] = this[name] > 0 ? -1 : 0;
			}

			// sticks
			this.leftStick.x = pad.axes[this.axeMapping.leftStick.x];
			this.leftStick.y = pad.axes[this.axeMapping.leftStick.y];

			this.rightStick.x = pad.axes[this.axeMapping.rightStick.x];
			this.rightStick.y = pad.axes[this.axeMapping.rightStick.y];

			// triggers
			if (this._axeTriggers) {
				this.leftTrigger = pad.axes[this.axeMapping.leftTrigger];
				this.rightTrigger = pad.axes[this.axeMapping.rightTrigger];
			} else {
				this.leftTrigger = pad.buttons[this.buttonMapping.lt].value;
				this.rightTrigger = pad.buttons[this.buttonMapping.rt].value;

				// only needs to be checked once
				if (this.hasAnalogTriggers === undefined && (this.leftTrigger || this.rightTrigger)) {
					this.hasAnalogTriggers = !Number.isInteger(this.leftTrigger) || !Number.isInteger(this.rightTrigger);
				}
			}
			return true; // update completed
		}

		_reset() {
			for (let name in this.buttonMapping) {
				this[name] = 0;
			}
			this.leftStick.x = 0;
			this.leftStick.y = 0;
			this.rightStick.x = 0;
			this.rightStick.y = 0;
			this.leftTrigger = 0;
			this.rightTrigger = 0;
		}
		// aliases for playstation face buttons
		get cross() {
			return this.a;
		}
		get circle() {
			return this.b;
		}
		get square() {
			return this.x;
		}
		get triangle() {
			return this.y;
		}
		/**
		 * Alias for `leftStick`.
		 */
		get ls() {
			return this.leftStick;
		}
		/**
		 * Alias for `rightStick`.
		 */
		get rs() {
			return this.rightStick;
		}
		/**
		 * Alias for `l` (left button).
		 * `lb` is what the button is called on Xbox controllers.
		 */
		get lb() {
			return this.l;
		}
		/**
		 * Alias for `r` (right button).
		 * `rb` is what the button is called on Xbox controllers.
		 */
		get rb() {
			return this.r;
		}
		/**
		 * Alias for `l` (left button).
		 * `l1` is what the button is called on PlayStation controllers.
		 */
		get l1() {
			return this.l;
		}
		/**
		 * Alias for `r` (right button).
		 * `r1` is what the button is called on PlayStation controllers.
		 */
		get r1() {
			return this.r;
		}
		/**
		 * Alias for `lt` (digital left trigger).
		 * `zl` is what the button is called on Nintendo controllers.
		 */
		get zl() {
			return this.lt;
		}
		/**
		 * Alias for `rt` (digital right trigger).
		 * `zr` is what the button is called on Nintendo controllers.
		 */
		get zr() {
			return this.rt;
		}
		/**
		 * Alias for `leftTrigger` (analog left trigger).
		 * `l2` is what the trigger is called on PlayStation controllers.
		 */
		get l2() {
			return this.leftTrigger;
		}
		/**
		 * Alias for `rightTrigger` (analog right trigger).
		 * `r2` is what the trigger is called on PlayStation controllers.
		 */
		get r2() {
			return this.rightTrigger;
		}
		/**
		 * Verbose alias for `lsb`.
		 */
		get leftStickButton() {
			return this.lsb;
		}
		/**
		 * Verbose alias for `rsb`.
		 */
		get rightStickButton() {
			return this.rsb;
		}
		/**
		 * Alias for `lsb` (left stick button).
		 * `l3` is what the trigger is called on PlayStation controllers.
		 */
		get l3() {
			return this.lsb;
		}
		/**
		 * Alias for `rsb` (right stick button).
		 * `r3` is what the trigger is called on PlayStation controllers.
		 */
		get r3() {
			return this.rsb;
		}
	};

	/**
	 * @class
	 * @extends Array<Contro>
	 */
	this._Contros = class extends Array {
		/**
		 * <a href="https://p5play.org/learn/input.html">
		 * Look at the Input reference pages before reading these docs.
		 * </a>
		 *
		 * Used internally to create the `contros` array (aka `controllers`)
		 * of `Contro` objects, which store the input status of buttons,
		 * triggers, and sticks on game controllers.
		 */
		constructor() {
			super();
			if (window) {
				window.addEventListener('gamepadconnected', (e) => {
					this._onConnect(e.gamepad);
				});
				window.addEventListener('gamepaddisconnected', (e) => {
					this._onDisconnect(e.gamepad);
				});
			}

			// test if the browser supports the HTML5 Gamepad API
			// all modern browsers do, this is really just to prevent
			// p5play's Jest tests from failing
			if (typeof navigator != 'object' || !navigator.getGamepads) return;

			// if the page was not reloaded, but p5play sketch was,
			// then gamepads could be already connected
			// so they need to be added as Contro objects
			let gps = navigator.getGamepads();
			for (let gp of gps) {
				if (gp) this._onConnect(gp);
			}
		}

		/**
		 * Swap controller positions in this controllers array.
		 * @param {Number} indexA
		 * @param {Number} indexB
		 * @example
		 * contros.swap(0, 3); // swap the first controller with the fourth
		 */
		swap(indexA, indexB) {
			let tmp = this[indexA];
			this[indexA] = this[indexB];
			this[indexB] = tmp;
			if (indexA == 0 || indexB == 0) {
				$.contro = this[0];
				if (!$._q5 && $._isGlobal) {
					window.contro = this[0];
				}
			}
		}

		/**
		 * Removes a controller from this controllers array
		 * by setting `contros[index] = null`.
		 *
		 * Newly connected controllers fill the first empty slot.
		 * @param {Number} index
		 */
		remove(index) {
			this[index] = null;
		}

		/**
		 * Runs when a controller is connected. By default it
		 * always returns true. Overwrite this function to customize
		 * the behavior.
		 *
		 * For example, it could be customized to filter
		 * controllers based on their model info.
		 *
		 * Doesn't run if a controller in the `controllers` array
		 * is reconnected.
		 * @type {Function}
		 * @param {Gamepad} gamepad
		 * @returns {Boolean} true if the controller should be added to this p5play controllers array
		 */
		onConnect(gamepad) {
			return true;
		}

		/**
		 * Runs when a controller is disconnected. by default it
		 * always returns false. Overwrite this function to customize
		 * the behavior.
		 *
		 * Removing a controller from the `controllers` array
		 * usually is not desirable, because the controller could be
		 * reconnected later. By default, the controller is kept in
		 * the array and its state is reset.
		 * @type {Function}
		 * @param {Gamepad} gamepad
		 * @returns {Boolean} true if the controllers should be removed from this p5play controllers array
		 */
		onDisconnect(gamepad) {
			return false;
		}

		_onConnect(gp) {
			if (!gp) return;
			for (let i = 0; i < this.length; i++) {
				if (gp.index == this[i].gamepad?.index) {
					this[i].connected = true;
					log('contros[' + i + '] reconnected: ' + gp.id);
					return;
				}
			}
			log(gp);
			if (this.onConnect(gp)) {
				let c = new $.Contro(gp);

				// get the index of the next available slot
				let index = 0;
				for (let i = 0; i <= this.length; i++) {
					if (!this[i]) {
						index = i;
						break;
					}
				}
				this[index] = c;
				log('contros[' + index + '] connected: ' + gp.id);
				if (index == 0) {
					$.contro = c;
					if ($._isGlobal) window.contro = c;
				}
			}
		}

		_onDisconnect(gp) {
			if (!gp) return;
			for (let i = 0; i < this.length; i++) {
				if (this[i].gamepad?.index === gp.index) {
					this[i].connected = false;
					log('contros[' + i + '] disconnected: ' + gp.id);
					if (this.onDisconnect(gp)) this.remove(i);
					else this[i]._reset();
					return;
				}
			}
		}

		/*
		 * Updates the state of all controllers.
		 */
		_update() {
			for (let c of this) {
				if (c.connected) c._update();
			}
		}
	};

	/**
	 * Array of game controllers.
	 * @type {_Contros}
	 */
	this.contros = new $._Contros();

	/**
	 * Alias for contros
	 * @type {_Contros}
	 */
	this.controllers = $.contros;

	/**
	 * For convenience, `contro` can be used to attempt to check the
	 * input states of `contros[0]` and won't throw errors if a controller
	 * isn't connected yet. By default it is set to a mock controller
	 * object which you can edit to test your game's input handling.
	 * @type {Contro}
	 */
	this.contro = new $.Contro('mock0');

	if ($._webgpuFallback) $._beginRender = false;

	/**
	 * FPS, amongst the gaming community, refers to how fast a computer
	 * can generate frames per second, not including the delay between when
	 * frames are actually shown on the screen. The higher the FPS, the
	 * better the game is performing.
	 *
	 * This function is used by the renderStats() function, which is the easiest way
	 * to get an approximation of your game's performance. But you should use your web
	 * browser's performance testing tools for accurate results.
	 *
	 * @returns {Number} The current FPS
	 */
	this.getFPS ??= () => $.p5play._fps;

	$.renderStats = () => {
		let rs = $.p5play._renderStats;
		if (!rs.fontSize) {
			if ($.allSprites.tileSize == 1 || $.allSprites.tileSize > 16) {
				rs.fontSize = 16;
			} else {
				rs.fontSize = 10;
			}
			rs.gap = rs.fontSize * 1.25;
		}

		if (!$.p5play._fpsAvg || $.frameCount % 20 === 0) {
			let avg = 0;
			let len = $.p5play._fpsArr.length;
			for (let i = 0; i < len; i++) {
				avg += $.p5play._fpsArr[i];
			}
			avg = Math.round(avg / len);
			let min = Math.min(...$.p5play._fpsArr);
			$.p5play._fpsAvg = avg;
			$.p5play._fpsMin = min;
			$.p5play._fpsMax = Math.max(...$.p5play._fpsArr);
			$.p5play._fpsArr = [];

			let c;
			if (min > 55) c = $.color(30, 255, 30);
			else if (min > 25) c = $.color(255, 100, 30);
			else c = $.color(255, 30, 30);
			$.p5play._statsColor = c;
		}

		$.p5play._fpsArr.push($.getFPS());

		$.push();
		$.fill(0, 0, 0, 128);
		$.rect(rs.x - 5, rs.y - rs.fontSize, rs.fontSize * 8.5, rs.gap * 5 + 5);
		$.fill($.p5play._statsColor);
		$.textAlign('left');
		$.textSize(rs.fontSize);
		if (rs.font) $.textFont(rs.font);

		let x = rs.x;
		let y = rs.y;
		$.text('sprites: ' + $.p5play.spritesDrawn, x, y);
		$.text('display: ' + Math.round($.frameRate()) + 'hz', x, y + rs.gap);
		$.text('fps avg: ' + $.p5play._fpsAvg, x, y + rs.gap * 2);
		$.text('fps min: ' + $.p5play._fpsMin, x, y + rs.gap * 3);
		$.text('fps max: ' + $.p5play._fpsMax, x, y + rs.gap * 4);
		$.pop();
	};

	/**
	 * p5play runs this function 60 times per second by default.
	 *
	 * Put input handling and game logic code in this function, which
	 * should run before physics simulation and drawing.
	 */
	this.update ??= () => {};

	/**
	 * p5play runs this function 60 times per second by default.
	 *
	 * Put drawing code in this function, which should run after
	 * input handling, game logic, and physics simulation.
	 */
	this.drawFrame ??= () => {};

	if ($._isGlobal && window.update) {
		$.update = window.update;
	}

	if ($._isGlobal && window.drawFrame) {
		$.drawFrame = window.drawFrame;
	}
});

// called before each draw function call
p5.prototype.registerMethod('pre', function p5playPreDraw() {
	const $ = this;
	if (!$._q5) {
		$.p5play._preDrawFrameTime = performance.now();
	}
	$.p5play.spritesDrawn = 0;

	$.mouse._update();
	$.contros._update();

	$.update();

	if ($.allSprites._autoUpdate) {
		$.allSprites.update();
	}
	$.allSprites._autoUpdate ??= true;
});

// called after each draw function call
p5.prototype.registerMethod('post', function p5playPostDraw() {
	const $ = this;
	$.p5play._inPostDraw = true;

	if ($.allSprites.autoCull) {
		$.allSprites.cull(10000);
	}

	if ($.world.autoStep && $.world.timeScale > 0) {
		$.world.physicsUpdate();
	}
	$.world.autoStep ??= true;

	$.drawFrame();

	if ($.allSprites._autoDraw) {
		$.camera.on();
		$.allSprites.draw();
	}
	$.allSprites._autoDraw ??= true;

	$.camera.off();

	$.allSprites.postDraw();

	if ($.p5play.renderStats) $.renderStats();

	for (let k in $.kb) {
		if (k == 'holdThreshold') continue;
		if ($.kb[k] < 0) $.kb[k] = 0;
		else if ($.kb[k] > 0) $.kb[k]++;
	}

	for (let i = 0; i < $.touches.length; i++) {
		let t = $.touches[i];
		t.duration++;
		if (t._dragFrame) {
			t.drag++;
			t._dragFrame = false;
		} else if (t.drag < 0) {
			t.drag = 0;
		}
		if (t.duration <= 0) {
			$.touches.splice(i, 1);
			i--;
		}
	}

	let m = $.mouse;
	let msm = $.world.mouseSprite?.mouse;

	for (let btn of ['left', 'center', 'right']) {
		if (m[btn] < 0) m[btn] = 0;
		else if (m[btn] > 0) m[btn]++;
		if (msm?.hover) msm[btn] = m[btn];

		if (m._dragFrame[btn]) {
			m.drag[btn]++;
			if (msm) msm.drag[btn] = m.drag[btn];
			m._dragFrame[btn] = false;
		} else if (m.drag[btn] < 0) {
			m.drag[btn] = 0;
			if (msm) msm.drag[btn] = 0;
		}
	}

	if ($.world.mouseTracking && $.mouse.isActive) {
		let sprites = $.world.getMouseSprites();

		for (let i = 0; i < sprites.length; i++) {
			let s = sprites[i];
			if (i == 0) s.mouse.hover++;
			else if (s.mouse.hover > 0) s.mouse.hover = -1;
			else if (s.mouse.hover < 0) s.mouse.hover = 0;
		}

		// if the user is not pressing any mouse buttons
		if (m.left <= 0 && m.center <= 0 && m.right <= 0) {
			$.world.mouseSprite = null;
		}

		let ms = $.world.mouseSprite;

		let isDragging = m.drag.left > 0 || m.drag.center > 0 || m.drag.right > 0;

		for (let s of $.world.mouseSprites) {
			// if the mouse stopped hovering over the sprite
			if (!sprites.includes(s)) {
				let sm = s.mouse;
				if (sm.hover > 0) {
					sm.hover = -1;
					sm.left = sm.center = sm.right = 0;
				}
				// if mouse is not dragging and the sprite is the current mouse sprite
				if (!isDragging && s == ms) $.world.mouseSprite = ms = null;
			}
		}
		if (ms) {
			// if the user is dragging on a sprite, but not currently hovering
			// over it, the mouse sprite should still be added to the mouseSprites array
			if (!sprites.includes(ms)) sprites.push(ms);
			msm.x = ms.x - m.x;
			msm.y = ms.y - m.y;
		}
		$.world.mouseSprites = sprites;
	}

	if (!$._q5) {
		$.p5play._postDrawFrameTime = performance.now();
		$.p5play._fps = Math.round(1000 / ($.p5play._postDrawFrameTime - $.p5play._preDrawFrameTime)) || 1;
	}
	$.p5play._inPostDraw = false;
});
