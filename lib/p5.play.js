/**
 * p5.play v3
 * Upgraded and maintained by Quinton Ashley @quinton-ashley, 2022
 * https://quintos.org
 *
 * p5.play was founded by Paolo Pedercini @molleindustria, 2015
 * https://molleindustria.org/
 */
p5.prototype.registerMethod('init', function p5PlayInit() {
	const log = console.log; // shortcut

	// store a reference to the p5 instance that p5play is being added to
	let pInst = this;
	this.angleMode(p5.prototype.DEGREES);

	const pl = planck;
	pl.Settings.velocityThreshold = 0.19;

	let world;
	let plScale = 60;
	this._p5play = {};
	this._p5play.autoDrawSprites = true;
	this._p5play.autoUpdateSprites = true;

	const scaleTo = ({ x, y }) => new pl.Vec2((x * world.tileSize) / plScale, (y * world.tileSize) / plScale);
	const scaleFrom = ({ x, y }) => new pl.Vec2((x / world.tileSize) * plScale, (y / world.tileSize) * plScale);
	const fixRound = (val) => (Math.abs(val - Math.round(val)) <= pl.Settings.linearSlop ? Math.round(val) : val);

	let spriteCount = 0;
	let groupCount = 0;

	let contacts = [];

	/**
	 * What is a sprite? Sprites are ghosts!
	 *
	 * Video game developers use the word sprite to refer to
	 * characters, items, enemies, or any other objects that
	 * move above a background.
	 *
	 * In p5.play a sprite can be anything. Sprites have
	 * properties such as: position, width, height, and speed.
	 * They can be displayed using a simple shape, image, or animation.
	 *
	 * By default sprites have a dynamic physics collider.
	 * Colliders are used to resolve overlaps or collisions
	 * with other sprites.
	 *
	 * Every sprite you create is added to the allSprites
	 * group and put on the top layer, in front of all other
	 * previously created sprites.
	 *
	 * Look at all the examples to learn how to create many different
	 * kinds of sprites.
	 *
	 * @example
	 *
	 *   let rectangle = new Sprite(x, y, width, height);
	 *
	 *   let circle = new Sprite(x, y, diameter);
	 *
	 *   let line = new Sprite(x, y, [length, angle]);
	 *
	 *   let chain = new Sprite(x, y, [length0, angle0, length1, angle1]);
	 *
	 * @class Sprite
	 * @constructor
	 * @param {String|SpriteAnimation|p5.Image} [aniName|ani|image]
	 * @param {Number} x Horizontal position of the sprite
	 * @param {Number} y Vertical position of the sprite
	 * @param {Number} [width|diameter] Width of the placeholder rectangle and of
	 * the collider until an image or new collider are set. *OR* If height is not
	 * set then this parameter becomes the diameter of the placeholder circle.
	 * @param {Number} [height] Height of the placeholder rectangle and of the collider
	 * until an image or new collider are set
	 * @param {String} [physics] collider type is 'dynamic' by default, can be
	 * 'static', 'kinematic', or 'none'
	 */
	class Sprite {
		constructor(x, y, w, h, collider) {
			this.p = pInst;
			let args = [...arguments];

			if (!world) world = new World();

			/**
			 * Groups the sprite belongs to, including allSprites
			 *
			 * @property groups
			 * @type {Array}
			 */
			this.groups = [];
			this.p.allSprites.add(this);

			/**
			 * Keys are the animation label, values are SpriteAnimation objects.
			 *
			 * @property animations
			 * @type {Object}
			 */
			this.animations = {};

			/**
			 * Reference to the sprite's current animation.
			 *
			 * @property animation
			 * @type {SpriteAnimation}
			 */
			this.animation = undefined;

			/**
			 * If false, animations that are stopped before they are completed,
			 * typically by a call to sprite.changeAnimation, will start at the frame
			 * they were stopped at. If true, animations will always start playing from
			 * frame 0 unless specified by the user in a separate anim.changeFrame
			 * call.
			 *
			 * @property autoResetAnimations
			 * @type {SpriteAnimation}
			 * @default false
			 */
			this.autoResetAnimations = false;

			/**
			 * True if the sprite was removed from the world
			 *
			 * @property removed
			 * @type {Boolean}
			 * @default false
			 */
			this.removed = false;

			/**
			 * The kind of shape: 'box', 'circle', 'polygon', or 'chain'
			 *
			 * @property shape
			 * @type {String}
			 * @default box
			 */
			this.shape;

			let ani, group;

			if (args[0] !== undefined && args[0] instanceof Group) {
				group = args[0];
				args = args.slice(1);
				this.addToGroup(group);
				for (let _ani in group.animations) {
					ani = _ani;
					break;
				}
			}
			if (args[0] !== undefined && typeof args[0] != 'number') {
				// ani instanceof p5.Image
				// shift
				ani = args[0];
				args = args.slice(1);
			}

			if (arguments.length != args.length) {
				x = args[0];
				y = args[1];
				w = args[2];
				h = args[3];
				collider = args[4];
			}

			if (Array.isArray(w) || (!isNaN(w) && typeof h == 'string')) {
				collider = h;
				h = undefined;
			} else if (isNaN(w)) {
				collider = w;
				w = undefined;
			}

			if (group) {
				collider ??= group.collider;
				this.shape = group.shape;
			}

			/**
			 * Cycles before self removal.
			 * Set it to initiate a countdown, every draw cycle the property is
			 * reduced by 1 unit. If less than or equal to 0, this sprite will be removed.
			 *
			 * @property life
			 * @type {Number}
			 * @default 10000000
			 */
			this.life = 10000000;

			/**
			 * The sprite's visibility.
			 *
			 * @property visible
			 * @type {Boolean}
			 * @default true
			 */
			this.visible = true;

			/**
			 * If no image or animations are set this is color of the
			 * placeholder rectangle
			 *
			 * @property shapeColor
			 * @type {color}
			 * @default a randomly generated color
			 */
			this.shapeColor = this.p.color(this.p.random(255), this.p.random(255), this.p.random(255));

			/**
			 * Contains all the collision callback functions for this sprite
			 * when it comes in contact with other sprites or groups.
			 */
			this.collides = {};

			/**
			 * Contains all the overlap callback functions for this sprite
			 * when it comes in contact with other sprites or groups.
			 */
			this.overlaps = {};

			let _this = this;

			/**
			 * Set position using .x and .y instead.
			 *
			 * @deprecated
			 */
			this.position = {
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

			this._pos = {
				x: 0,
				y: 0
			};

			this._vel = {
				x: 0,
				y: 0
			};

			/**
			 * A vector representing how fast the sprite is moving horizontally
			 * and vertically.
			 *
			 * @property vel
			 */
			this.vel = {
				get x() {
					if (!_this.body) return _this._vel.x;
					return _this.body.getLinearVelocity().x;
				},
				set x(val) {
					if (_this.body) {
						_this.body.setLinearVelocity(new pl.Vec2(val, _this.body.getLinearVelocity().y));
					} else {
						_this._vel.x = val;
					}
				},
				get y() {
					if (!_this.body) return _this._vel.y;
					return _this.body.getLinearVelocity().y;
				},
				set y(val) {
					if (_this.body) {
						_this.body.setLinearVelocity(new pl.Vec2(_this.body.getLinearVelocity().x, val));
					} else {
						_this._vel.y = val;
					}
				}
			};

			/**
			 * Verbose/legacy version of sprite.vel
			 *
			 * @property velocity
			 */
			this.velocity = {
				get x() {
					return _this.vel.x;
				},
				set x(val) {
					_this.vel.x = val;
				},
				get y() {
					return _this.vel.y;
				},
				set y(val) {
					_this.vel.y = val;
				}
			};

			/**
			 * Object containing information about the most recent collision/overlapping
			 * To be typically used in combination with Sprite.overlap or Sprite.collide
			 * functions.
			 * The properties are touching.left, touching.right, touching.top,
			 * touching.bottom and are either true or false depending on the side of the
			 * collider.
			 *
			 * @property touching
			 * @type {Object}
			 */
			this.touching = {};
			this.touching.left = null;
			this.touching.right = null;
			this.touching.top = null;
			this.touching.bottom = null;

			if (ani) {
				if (ani instanceof p5.Image) {
					w ??= ani.width;
					if (this.shape != 'circle') h ??= ani.height;
					this.addImage(ani);
				} else {
					if (typeof ani == 'string') this.ani(ani);
					else this.animation = ani;
					w ??= this.animation.width;
					if (this.shape != 'circle') h ??= this.animation.height;
				}
			}

			if (!group) {
				this.layer = this.p.allSprites.maxDepth() + 1;
			} else {
				this.layer = group.layer || 0;
				collider ??= group.collider;
			}

			if (!collider || typeof collider != 'string') {
				collider = 'dynamic';
			}

			x ??= 0;
			y ??= 0;
			if (collider != 'none' && collider != 'n') {
				this.body = world.createBody({
					position: scaleTo({ x, y }),
					type: collider
				});
				this.body.sprite = this;

				this.addCollider(0, 0, w, h);
			} else {
				this.x = x;
				this.y = y;
				this.w = w;
				this.h = h;
			}

			this.previousPosition = { x, y };
			this.dest = { x, y };
			this.vel.x = 0;
			this.vel.y = 0;
			this.scale = 1;
			this._mirrorX = 1;
			this._mirrorY = 1;
			this.debug = false;
			this._shift = {};
			this.idNum = spriteCount;
			spriteCount++;
		}

		/**
		 * Similar to createSprite and the Sprite constructor except
		 * offset is the distance the collider is from the center of the
		 * sprite.
		 *
		 * @param {Number} offsetX distance from the center of the sprite
		 * @param {Number} offsetY distance from the center of the sprite
		 */
		addCollider(offsetX, offsetY, w, h) {
			let path, shape;

			offsetX ??= 0;
			offsetY ??= 0;
			w ??= this.w;
			h ??= this.h;

			if (Array.isArray(w)) {
				path = w;
			} else {
				if (w !== undefined && h === undefined) shape ??= 'circle';
				shape ??= 'box';
			}

			if (shape == 'box' || shape == 'circle') {
				w ??= world.tileSize > 1 ? 1 : 100;
				this.width = w;
				h ??= w;
				this.height = h;
				if (shape == 'circle') this.diameter = w;
			}

			let props = {};

			let dimensions;

			// the actual dimensions of the collider for a box or circle are a
			// little bit smaller so that they can slid past each other
			// when in a tile grid
			if (shape == 'box' || shape == 'circle') {
				dimensions = scaleTo({ x: w - 0.08, y: h - 0.08 });
			}

			let s;
			if (shape == 'box') {
				s = pl.Box(dimensions.x / 2, dimensions.y / 2, scaleTo(offsetX, offsetY), 0);
			} else if (shape == 'circle') {
				s = pl.Circle(dimensions.x / 2);
				s.m_p.x = 0;
				s.m_p.y = 0;
			} else if (path) {
				let vecs = [{ x: 0, y: 0 }];
				let vert = { x: 0, y: 0 };
				let min = { x: 0, y: 0 };
				let max = { x: 0, y: 0 };

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
						if (vert.x < min.x) min.x = vert.x;
						if (vert.y < min.y) min.y = vert.y;
						if (vert.x > max.x) max.x = vert.x;
						if (vert.y > max.y) max.y = vert.y;
					}
					ang *= mod;
				}
				if (
					Math.round(vert.x * 1e6) / 1e6 == 0 &&
					Math.round(vert.y * 1e6) / 1e6 == 0 &&
					vecs.length - 1 <= pl.Settings.maxPolygonVertices
				) {
					shape = 'polygon';
				} else {
					shape = 'chain';
				}
				this.w = max.x - min.x;
				this.h = max.y - min.y;
				for (let i = 0; i < vecs.length; i++) {
					let vec = vecs[i];
					vecs[i] = new pl.Vec2(
						((vec.x - this._hw - min.x) * world.tileSize) / plScale,
						((vec.y - this._hh - min.y) * world.tileSize) / plScale
					);
				}
				if (shape == 'polygon') {
					if (this._isConvexPoly(vecs.slice(0, -1))) {
						s = pl.Polygon(vecs);
					} else shape = 'chain';
				}
				if (shape == 'chain') {
					s = pl.Chain(vecs, false);
					props.density = 0;
					props.restitution = 0;
				}
			}
			props.shape = s;
			props.density ??= this.density || 5;
			props.friction ??= this.friction || 0.5;
			props.restitution ??= this.bounciness || 0.2;
			this.body.createFixture(props); /*RPC051521*/ /*RPC052521*/
			if (!this.shape) {
				this.shape = shape;
			} else {
				this.shape = 'combo';
			}
		}

		/**
		 * In p5.play v3 there is no need for users to use this method.
		 *
		 * @deprecated
		 */
		setDefaultCollider() {
			this.addCollider();
		}

		/**
		 * Use sprite.addCollider instead.
		 *
		 * @deprecated
		 */
		setCollider(shape, x, y, w, h) {
			this.addCollider(x, y, w, h);
		}

		/**
		 * Removes the physics body collider from the sprite.
		 *
		 * Avoid using this method. It is more efficient to set the physics
		 * body type of the sprite to 'none'.
		 *
		 * @method removeCollider
		 */
		removeCollider() {
			world.destroyBody(this.body);
		}

		/**
		 * The Angle Aligned Bounding Box of the sprite's physics body.
		 *
		 * @private
		 * @type {Object}
		 */
		get aabb() {
			return getAABB(this);
		}

		// set advance(val) {
		// 	this.body.advance(val);
		// }
		// set angularImpulse(val) {
		// 	this.body.applyAngularImpulse(val, true);
		// }

		/**
		 * The bounciness of the sprite's physics body.
		 *
		 * @property bounciness
		 * @type {Number}
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
		 * @property centerOfMass
		 * @type {Number}
		 */
		get centerOfMass() {
			return scaleFrom(this.body.getWorldCenter());
		}
		/**
		 * Use sprite.animation.name instead.
		 *
		 * @deprecated
		 * @type {String}
		 */
		get currentAnimation() {
			return this.animation.name;
		}

		/**
		 * The density of the sprite's physics body.
		 *
		 * @property density
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
		 * @deprecated
		 * @property depth
		 */
		get depth() {
			return this.layer;
		}
		set depth(val) {
			this.layer = val;
		}

		/**
		 * The angle of the sprite's movement or it's rotation angle if the
		 * sprite is not moving.
		 *
		 * @property drag
		 * @type {Number}
		 */
		get direction() {
			if (this._direction) return this._direction;
			if (this.vel.x !== 0 || this.vel.y !== 0) {
				return this.p.atan2(this.vel.y, this.vel.x);
			}
			return this.rotation;
		}
		set direction(val) {
			this._direction = val;
		}

		/**
		 * The amount of resistance a sprite has to being moved.
		 *
		 * @property drag
		 * @type {Number}
		 */
		get drag() {
			return this.body.getLinearDamping();
		}
		set drag(val) {
			this.body.setLinearDamping(val);
		}

		/**
		 * True if the sprite's physics body is dynamic.
		 *
		 * @property dynamic
		 * @type {Boolean}
		 */
		get dynamic() {
			return this.body.isDynamic();
		}
		set dynamic(val) {
			if (val) this.body.setDynamic();
		}

		/**
		 * If true the sprite can not rotate.
		 *
		 * @property rotationLocked
		 * @type {Boolean}
		 */
		get rotationLocked() {
			return this.body.isFixedRotation();
		}
		set rotationLocked(val) {
			this.body.setFixedRotation(val);
		}

		get fixture() {
			return this.fixtureList;
		}
		get fixtureList() {
			return this.body.getFixtureList();
		}

		// set force(val) {
		// 	this.body.applyForceToCenter(val, true);
		// }

		/**
		 * The amount the sprite's physics body resists moving
		 * when rubbing against another physics body.
		 *
		 * @property friction
		 * @type {Number}
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
		 * Use .static instead.
		 *
		 * @deprecated
		 * @property immovable
		 */
		get immovable() {
			return this.body.isStatic();
		}
		set immovable(val) {
			if (val) this.body.setStatic();
		}
		// set impulse(val) {
		// 	this.body.applyLinearImpulse(val, this.body.getWorldCenter(), true);
		// }
		// get inertia() {
		// 	return this.body.getInertia();
		// }

		/**
		 * Set this to true if the sprite goes really fast to prevent
		 * inaccurate physics simulation.
		 *
		 * @property isSuperFast
		 * @type {Boolean}
		 */
		get isSuperFast() {
			return this.body.isBullet();
		}
		set isSuperFast(val) {
			this.body.setBullet(val);
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
		 * @property kinematic
		 * @type {Boolean}
		 */
		get kinematic() {
			return this.body.isKinematic();
		}
		set kinematic(val) {
			if (val) this.body.setKinematic();
		}
		/**
		 * The mass of the sprite's physics body.
		 *
		 * @property mass
		 * @type {Number}
		 */
		get mass() {
			return this.body.getMass();
		}
		set mass(val) {
			let t = this.massData;
			t.mass = val;
			this.body.setMassData(t);
		}
		/**
		 * @private
		 */
		get massData() {
			const t = { I: 0, center: new pl.Vec2(0, 0), mass: 0 };
			this.body.getMassData(t);
			t.center = scaleFrom(t.center);
			return t;
		}
		// set massData(val) {
		// 	val.center = scaleTo(val.center);
		// 	this.body.setMassData(val);
		// }

		/**
		 * Setting mirrorX to true will mirror the sprite horizontally.
		 *
		 * @property mirrorX
		 * @type {Boolean}
		 */
		get mirrorX() {
			return this._mirrorX;
		}
		set mirrorX(val) {
			this._mirrorX = val ? -1 : 1;
		}
		/**
		 * Setting mirrorY to true will mirror the sprite vertically.
		 *
		 * @property mirrorY
		 * @type {Boolean}
		 */
		get mirrorY() {
			return this._mirrorY;
		}
		set mirrorY(val) {
			this._mirrorY = val ? -1 : 1;
		}

		// get next() {
		// 	return this.body.getNext();
		// }

		/**
		 * The angle of the sprite's rotation, not the direction it is moving.
		 *
		 * @property rotation
		 * @type {Number}
		 */
		get rotation() {
			if (!this.body) return this._angle || 0;
			if (this.p._angleMode === p5.prototype.DEGREES) {
				return p5.prototype.degrees(this.body.getAngle());
			}
			return this.body.getAngle();
		}
		set rotation(val) {
			if (this.body) {
				if (this.p._angleMode === p5.prototype.DEGREES) {
					this.body.setAngle(p5.prototype.radians(val));
				} else {
					this.body.setAngle(val);
				}
			} else {
				this._angle = val;
			}
		}
		/**
		 * The amount of the sprite resists rotating.
		 *
		 * @property rotationDrag
		 * @type {Number}
		 */
		get rotationDrag() {
			return this.body.getAngularDamping();
		}
		set rotationDrag(val) {
			this.body.setAngularDamping(val);
		}
		/**
		 * The speed of the sprite's rotation.
		 *
		 * @property rotationSpeed
		 * @type {Number}
		 */
		get rotationSpeed() {
			if (this.body) return this.body.getAngularVelocity();
			return this._rotationSpeed || 0;
		}
		set rotationSpeed(val) {
			if (this.body) this.body.setAngularVelocity(val);
			else this._rotationSpeed = val;
		}
		// get physicsBody() {
		// 	return this._physicsBody;
		// }
		// set physicsBody(val) {
		// 	if (val == 'none') {
		// 		this.removeCollider();
		// 	} else if (val == 'static') {
		// 		this.static = true;
		// 	} else if (val == 'kinematic') {
		// 		this.kinematic = true;
		// 	} else if (val == 'dynamic') {
		// 		this.dynamic = true;
		// 	}
		// }
		// get sensor() {
		// 	return this.body.m_fixtureList.isSensor();
		// }
		// set sensor(val) {
		// 	for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
		// 		fxt.setSensor(val);
		// 	}
		// }
		/**
		 * The sprite's speed.
		 *
		 * @property speed
		 * @type {Number}
		 */
		get speed() {
			return this.p.createVector(this.vel.x, this.vel.y).mag();
		}

		/**
		 * @deprecated
		 */
		getSpeed() {
			return this.speed;
		}
		/**
		 * The sprite's speed.
		 *
		 * @property speed
		 * @type {Number}
		 * @param {Number} speed that the sprite will move at in the direction of its current rotation
		 */
		set speed(val) {
			let angle = this._direction;
			angle ??= this.direction;

			this.vel.x = this.p.cos(angle) * val;
			this.vel.y = this.p.sin(angle) * val;
			this._direction = null;
		}

		/**
		 * Is the sprite's physics collider static?
		 *
		 * @property static
		 * @type {Boolean}
		 */
		get static() {
			return this.body.isStatic();
		}
		set static(val) {
			if (val) this.body.setStatic();
		}
		// set torque(val) {
		// 	this.body.applyTorque(val, true);
		// }
		// get transform() {
		// 	const t = this.body.getTransform();
		// 	return { position: scaleFrom(t.p), angle: asin(t.q.s) };
		// }
		// set transform({ position, angle }) {
		// 	this.body.setTransform(scaleTo(position), angle);
		// }
		// get world() {
		// 	return this.body.getWorld();
		// }

		/**
		 * The horizontal position of the sprite.
		 * @property x
		 * @type {Number}
		 */
		get x() {
			if (!this.body) return this._pos.x;
			let x = (this.body.getPosition().x / world.tileSize) * plScale;
			return fixRound(x);
		}
		set x(val) {
			if (this.body) {
				let pos = new pl.Vec2((val * world.tileSize) / plScale, this.body.getPosition().y);
				this.body.setPosition(pos);
			} else {
				this._pos.x = val;
			}
		}
		/**
		 * The vertical position of the sprite.
		 * @property y
		 * @type {Number}
		 */
		get y() {
			if (!this.body) return this._pos.y;
			let y = (this.body.getPosition().y / world.tileSize) * plScale;
			return fixRound(y);
		}
		set y(val) {
			if (this.body) {
				let pos = new pl.Vec2(this.body.getPosition().x, (val * world.tileSize) / plScale);
				this.body.setPosition(pos);
			} else {
				this._pos.y = val;
			}
		}
		/**
		 * Set the position vector {x, y}
		 *
		 * @property pos
		 * @type {Object}
		 */
		set pos(val) {
			let pos = new pl.Vec2((val.x * world.tileSize) / plScale, (val.y * world.tileSize) / plScale);
			_this.body.setPosition(pos);
		}
		/**
		 * The width of the sprite.
		 * @property w
		 * @type {Number}
		 */
		get w() {
			return this._w;
		}
		set w(val) {
			this._w = val;
			this._hw = val * 0.5;
		}
		/**
		 * The width of the sprite.
		 * @property width
		 * @type {Number}
		 */
		get width() {
			return this.w;
		}
		set width(val) {
			this.w = val;
		}
		/**
		 * The height of the sprite.
		 * @property h
		 * @type {Number}
		 */
		get h() {
			return this._h;
		}
		set h(val) {
			this._h = val;
			this._hh = val * 0.5;
		}
		/**
		 * The height of the sprite.
		 * @property height
		 * @type {Number}
		 */
		get height() {
			return this.h;
		}
		set height(val) {
			this.h = val;
		}
		/**
		 * The diameter of a circular sprite.
		 * @property d
		 * @type {Number}
		 */
		get d() {
			this._diameter ??= this.w;
			return this._diameter;
		}
		set d(val) {
			this._diameter = val;
			this.w = val;
			this.h = val;
		}
		/**
		 * The diameter of a circular sprite.
		 * @property diameter
		 * @type {Number}
		 */
		get diameter() {
			return this.d;
		}
		set diameter(val) {
			this.d = val;
		}

		/**
		 * Validate convexity. This is a very time consuming operation.
		 *
		 * @private
		 * @param vecs {Array} an array of planck.Vec2 vertices
		 * @returns true if valid
		 */
		_isConvexPoly(vecs) {
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
						return false;
					}
				}
			}

			return true;
		}

		/**
		 * Updates the sprite. Called automatically at the end of the draw
		 * cycle.
		 *
		 * @private
		 */
		update() {
			// if (this._shift.x || this._shift.y) {
			// 	this._shift.x ??= this.x;
			// 	this._shift.y ??= this.y;
			// 	let pos = new pl.Vec2((this._shift.x * world.tileSize) / plScale, (this._shift.y * world.tileSize) / plScale);
			// 	this.body.move(pos.x, pos.y);
			// 	this._shift = {};
			// }
			if (this.animation) this.animation.update();
			// this._syncAnimationSizes();
			//patch for un-preloaded single image sprites
			// if (this.width == 1 && this.height == 1) {
			// 	this.width = this.animation.getWidth();
			// 	this.height = this.animation.getHeight();
			// }
			if (this._rotationSpeed) this.rotation += this._rotationSpeed;
			if (this._vel.x) this.x += this._vel.x;
			if (this._vel.y) this.y += this._vel.y;
		}

		/**
		 * Displays the Sprite with rotation and scaling applied before
		 * the sprite is drawn.
		 *
		 * @private
		 */
		display() {
			let x = this.p.width * 0.5 - world.origin.x + this.x * world.tileSize;
			let y = this.p.height * 0.5 - world.origin.y + this.y * world.tileSize;

			// skip drawing for out-of-view bodies, but
			// edges can be very long, so they still should be drawn
			if (this.shape != 'chain' && (x < -100 || x > this.p.width + 100 || y < -100 || y > this.p.height + 100)) return;
			x = fixRound(x) - (this.w % 2) * 0.5;
			y = fixRound(y) - (this.h % 2) * 0.5;

			x += world.tileSize * 0.015;
			y += world.tileSize * 0.015;

			this.p.push();

			this.p.translate(x, y);
			if (this.rotation) this.p.rotate(this.rotation);
			this.p.scale(this.scale * this.mirrorX, this.scale * this.mirrorY);

			this.draw();

			this.p.pop();
		}

		/**
		 * Manages the visuals of the sprite. It can be overridden with a
		 * custom drawing function. The center of the sprite is (0, 0).
		 *
		 * @example
		 * sprite.draw = function() {
		 *   // an oval
		 *   ellipse(0,0,20,10);
		 * }
		 *
		 * @method draw
		 */
		draw() {
			if (this.animation && !this.debug) this.animation.draw(0, 0, 0);
			else {
				for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
					this.drawFixture(fxt);
				}
			}
		}

		/**
		 *
		 * @private
		 */
		drawFixture({ m_shape }) {
			this.p.fill(this.shapeColor);
			const s = m_shape;
			if (s.m_type == 'polygon' || s.m_type == 'chain') {
				if (s.m_type == 'chain') {
					this.p.push();
					this.p.noFill();
				}
				let v = s.m_vertices;
				this.p.beginShape();
				for (let i = 0; i < v.length; i++) {
					this.p.vertex(v[i].x * plScale, v[i].y * plScale);
				}
				if (s.m_type != 'chain') this.p.endShape(p5.prototype.CLOSE);
				else {
					this.p.endShape();
					this.p.pop();
				}
			} else if (s.m_type == 'circle') {
				const d = s.m_radius * plScale * 2;
				this.p.ellipse(s.m_p.x * plScale, s.m_p.y * plScale, d, d);
			} else if (s.m_type == 'edge') {
				this.p.line(s.m_vertex1.x * plScale, s.m_vertex1.y * plScale, s.m_vertex2.x * plScale, s.m_vertex2.y * plScale);
			}
		}

		/**
		 * Adds an image to the sprite.
		 * An image will be considered a one-frame animation.
		 * The image should be preloaded in the preload() function using p5 loadImage.
		 * Animations require a identifying label (string) to change them.
		 * The image is stored in the sprite but not necessarily displayed
		 * until Sprite.changeAnimation(label) is called
		 *
		 * Usages:
		 * - sprite.addImage(label, image);
		 * - sprite.addImage(image);
		 *
		 * If only an image is passed no label is specified
		 *
		 * @method addImage
		 * @param {String|p5.Image} label Label or image
		 * @param {p5.Image} [img] Image
		 */
		addImage() {
			if (typeof arguments[0] === 'string' && arguments[1] instanceof p5.Image) {
				this.addAnimation(arguments[0], arguments[1]);
			} else if (arguments[0] instanceof p5.Image) {
				this.addAnimation('normal', arguments[0]);
			} else if (typeof arguments[0] == 'string') {
				this.addAnimation('normal', loadImage(arguments[0]));
			} else {
				throw new TypeError('only accepts a p5.image, file path, or an image label string followed by a p5.image)');
			}
		}

		/**
		 * Adds an animation to the sprite. Use this function in the preload p5.js
		 * function. You don't need to name the animation if the sprite will only
		 * use one animation. See SpriteAnimation for more information.
		 *
		 * Uses:
		 * - sprite.addAnimation(label, animation);
		 * - sprite.addAnimation(label, firstFrame, lastFrame);
		 * - sprite.addAnimation(label, frame1, frame2, frame3...);
		 *
		 * @method addAnimation
		 * @param {String} label SpriteAnimation identifier
		 * @param {SpriteAnimation} animation The preloaded animation
		 */
		addAnimation() {
			let args = [...arguments];
			let name, anim;
			if (args[0] instanceof SpriteAnimation) {
				anim = args[0].clone();
				name = anim.name || 'default';
				anim.name = name;
			} else if (args[1] instanceof SpriteAnimation) {
				name = args[0];
				anim = args[1].clone();
				anim.name = name;
			} else {
				anim = new SpriteAnimation(...args);
				name = anim.name;
			}
			anim.isSpriteAnimation = true;
			this.animations[name] = anim;
			if (!this.animation) {
				this.animation = anim;
				this.w ??= anim.width;
				this.h ??= anim.height;
			}
			return anim;
		}

		/**
		 * Changes the displayed image/animation.
		 * Equivalent to changeAnimation
		 *
		 * @method changeImage
		 * @param {String} label Image/SpriteAnimation identifier
		 */
		changeImage(label) {
			this.changeAnimation(label);
		}

		/**
		 * Changes the displayed animation. The animation must be added first
		 * using the sprite.addAnimation method. The animation could also be
		 * added using the group.addAnimation method to a group the sprite
		 * has been added to.
		 *
		 * See SpriteAnimation for more control over the sequence.
		 *
		 * @method changeAnimation
		 * @param {String} label SpriteAnimation identifier
		 */
		_changeAnimation(label) {
			let anim = this.animations[label];
			if (!anim) {
				for (let g of this.groups) {
					anim = g.animations[label];
					if (anim) break;
				}
			}
			if (!anim) {
				this.p.print('changeAnimation error: no animation labeled ' + label);
				return;
			}
			this.animation = anim;
			this.animation.name = label;
			// reset to frame 0 of that animation
			if (this.autoResetAnimations) this.animation.frame = 0;
		}

		changeAnimation() {
			return this.ani(...arguments);
		}

		/**
		 * Set the velocity vector.
		 *
		 * @deprecated
		 * @param {Number} x horizontal velocity
		 * @param {Number} y vertical velocity
		 */
		setVelocity(x, y) {
			this.body.setLinearVelocity(new pl.Vec2(x, y));
		}

		/**
		 * Deprecated: set direction and speed separately
		 *
		 * Set the speed of the sprite.
		 * The action overwrites the current velocity.
		 * If direction is not supplied, the current direction is maintained.
		 * If direction is not supplied and there is no current velocity, the current
		 * rotation angle used for the direction.
		 *
		 * @method setSpeed
		 * @deprecated
		 * @param {Number} speed Scalar speed
		 * @param {Number} [direction] angle
		 */
		setSpeed(speed, direction) {
			if (direction) this.direction = direction;
			this.speed = speed;
		}

		/**
		 * Add to the speed of the sprite.
		 * If direction is not supplied, the current direction is maintained.
		 * If direction is not supplied and there is no current velocity, the current
		 * rotation angle used for the direction.
		 *
		 * @method addSpeed
		 * @param {Number} speed Scalar speed
		 * @param {Number} [angle] Direction in degrees
		 */
		addSpeed(speed, angle) {
			angle ??= this.direction;

			this.vel.x += this.p.cos(angle) * speed;
			this.vel.y += this.p.sin(angle) * speed;
		}

		getDirection() {
			return this.direction;
		}

		/**
		 * Move a sprite towards a position
		 *
		 * @method moveTowards
		 * @param {Number} destX destination x
		 * @param {Number} destY destination y
		 * @param {Number} tracking 1 represents 1:1 tracking, the mouse moves to the destination immediately, 0 represents no tracking
		 */
		moveTowards(destX, destY, tracking) {
			if (!destX && !destY) return;
			tracking ??= 0.1;
			this.vel.x = (destX - this.x) * tracking * world.tileSize;
			this.vel.y = (destY - this.y) * tracking * world.tileSize;
		}

		/**
		 * Move the sprite to a destination position
		 *
		 * @method move
		 * @param {Number} destX destination x
		 * @param {Number} destY destination y
		 * @param {Number} speed scalar
		 * @param {Function} cb callback, called when movement is complete
		 * @returns {Promise} resolves when the movement is complete
		 */
		move(destX, destY, speed, cb) {
			if (typeof destX == 'undefined') {
				console.error('sprite.move ERROR: movement direction or destination not defined');
				return;
			}
			// if the sprite is moving stop it from moving in the direction it used to be moving in
			// if (this.isMoving) {
			// 	this.velocity.x = 0;
			// 	this.velocity.y = 0;
			// }
			let direction = true;
			// if destY is actually the direction (up, down, left, or right)
			if (typeof destX == 'string') {
				// shift input parameters over by one
				cb = arguments[2];
				speed = arguments[1];
				direction = arguments[0];
				destX = this.dest.x;
				destY = this.dest.y;
				if (direction == 'up') destY--;
				if (direction == 'down') destY++;
				if (direction == 'left') destX--;
				if (direction == 'right') destX++;
				if (/(up|down)/.test(direction)) {
					this.dest.y = destY;
				}
				if (/(left|right)/.test(direction)) {
					this.dest.x = destX;
				}
				this.direction = direction;
			} else {
				this.dest.x = destX;
				this.dest.y = destY;
			}

			if (world.tileSize > 1) speed ??= 0.1;
			speed ??= 1;
			if (speed <= 0) {
				console.warn('sprite.move: speed should be a positive number');
				speed = Math.abs(speed);
			}
			this.isMoving = true;

			let dist = Math.max(Math.abs(this.x - destX), Math.abs(this.y - destY));

			let percent = speed / dist;

			this.vel.x = (destX - this.x) * percent * world.tileSize;
			this.vel.y = (destY - this.y) * percent * world.tileSize;

			let totalSpeed = Math.sqrt(this.vel.x ** 2 + this.vel.y ** 2);

			// estimate how many frames it will take for the sprite
			// to reach its destination
			let frames = Math.floor(dist / totalSpeed) - 5;

			// margin of error
			let margin = totalSpeed - 0.001;

			return (async () => {
				let distX = margin + margin;
				let distY = margin + margin;
				do {
					await p5.prototype.delay();

					// skip calculations if not close enough to destination yet
					if (frames > 0) {
						frames--;
						continue;
					}
					// check if the sprite has reached its destination
					distX = Math.abs(this.x - this.dest.x);
					distY = Math.abs(this.y - this.dest.y);
				} while (this.isMoving && (distX > margin || distY > margin));
				// stop moving the sprite
				this.x = this.dest.x;
				this.y = this.dest.y;
				this.vel.x = 0;
				this.vel.y = 0;
				this.isMoving = false;
				// if a callback was given, call it
				if (typeof cb == 'function') cb();
			})();
		}

		/**
		 * Same as sprite.move
		 *
		 * @method moveTo
		 */
		moveTo(destX, destY, speed, cb) {
			return this.move(destX, destY, speed, cb);
		}

		/**
		 * Pushes the sprite toward a point.
		 * The force is added to the current velocity.
		 *
		 * Legacy method, use move or moveTowards instead.
		 *
		 * @deprecated
		 * @param {Number}  magnitude Scalar speed to add
		 * @param {Number}  x Direction x coordinate
		 * @param {Number}  y Direction y coordinate
		 */
		attractionPoint(magnitude, x, y) {
			let angle = this.p.atan2(y - this.y, x - this.x);
			this.vel.x += this.p.cos(angle) * magnitude;
			this.vel.y += this.p.sin(angle) * magnitude;
		}

		/**
		 * Rotates the sprite towards a position or angle.
		 *
		 * @method rotateTowards
		 * @param {*} angle
		 * @param {*} tracking
		 */
		rotateTowards(x, y, tracking) {
			// tracking ??= 0.1;
			// console.log(angle, this.rotation, ang);
			// this.angularVelocity = (angle - this.rotation) * tracking;
		}

		/**
		 * Rotates the sprite to an angle with a specified speed.
		 *
		 * @method rotate
		 * @param {Number} angle
		 * @param {Number} speed
		 */
		rotate(angle, speed) {
			if (!angle) {
				throw new Error('angle must be a number greater or less than zero');
			}
			let ang = this.rotation + angle;
			let mod = ang - this.rotation > 0 ? 1 : -1;
			this.rotationSpeed = speed * mod;

			return (async () => {
				let cw = ang > this.rotation;
				while ((cw && this.rotation < ang) || (!cw && this.rotation > ang)) {
					await p5.prototype.delay();
				}
				this.rotationSpeed = 0;
				this.rotation = ang;
			})();
		}

		/**
		 * Changes the sprite's animation. Use `addAni` to define the
		 * animation(s) first.
		 *
		 * @method ani
		 * @param {...String} anis the names of one or many animations to be played in
		 * sequence
		 * @returns A promise that fulfills when the animation or sequence of animations
		 * completes
		 */
		async ani(...anis) {
			let count = ++this._aniChanged;

			for (let i = 0; i < anis.length; i++) {
				if (typeof anis[i] == 'string') anis[i] = { name: anis[i] };
				let ani = anis[i];
				if (ani.name[0] == '!') {
					ani.name = ani.name.slice(1);
					ani.start = -1;
					ani.end = 0;
				}
			}

			let _ani = (name, start, end) => {
				return new Promise((resolve) => {
					this._changeAnimation(name);
					if (start < 0) {
						start = this.animation.images.length + start;
					}
					if (start) this.animation.frame = start;
					if (end != undefined) this.animation.goToFrame(end);
					this.animation.onComplete = () => {
						resolve();
					};
				});
			};

			for (let i = 0; i < anis.length; i++) {
				let ani = anis[i];
				if (ani.name == '*') {
					if (count == this._aniChanged) i = 0;
					continue;
				}
				let { name, start, end } = ani;
				await _ani(name, start, end);
			}
		}

		/**
		 * Change the sprite's image
		 *
		 * @param {String} img The name of the image
		 * @returns A promise that returns when the sequence is complete
		 */
		img(img) {
			return this.ani(img);
		}

		/**
		 * Add an animation.
		 *
		 * @param {String} name
		 * @param {Object} atlas
		 */
		addAni(name, atlas) {
			if (typeof name != 'string') {
				atlas = name;
				name = 'default';
			}
			if (Array.isArray(atlas)) {
				atlas = { pos: atlas };
			}
			let { size, pos, line, frames, frameDelay } = atlas;
			size ??= [this.w / this.scale, this.h / this.scale];
			pos ??= line || 0;
			let spriteSheetImg = this.spriteSheet || world.spriteSheet;
			this.addAnimation(name, createAni(spriteSheetImg, size, pos, frames, frameDelay));
		}

		addImg(name, atlas) {
			this.addAni(name, atlas);
		}

		/**
		 * Add multiple animations
		 *
		 * @method addAnis
		 * @param {Object} atlases
		 */
		addAnis(atlases) {
			for (let name in atlases) {
				let atlas = atlases[name];
				this.addAni(name, atlas);
			}
		}

		/**
		 * Removes the Sprite from the sketch.
		 * The removed Sprite will not be drawn or updated anymore.
		 *
		 * @method remove
		 */
		remove() {
			if (this.body) world.destroyBody(this.body);
			this.removed = true;

			//when removed from the "scene" also remove all the references in all the groups
			while (this.groups.length > 0) {
				this.groups[0].remove(this);
			}
		}

		/**
		 * Adds the sprite to an existing group
		 *
		 * @method addToGroup
		 * @param {Group} group
		 */
		addToGroup(group) {
			if (group instanceof Array) {
				// if the sprite has not been already to the group
				if (group.add(this)) this.groups.push(group);
			} else this.p.print('addToGroup error: ' + group + ' is not a group');
		}

		/**
		 * Returns the sprite's unique identifier
		 *
		 * @method toString
		 * @returns the sprite's id
		 */
		toString() {
			return 's' + this.idNum;
		}

		createJoint(type, { body }, props, anchor) {
			let j;
			const bodyA = this;
			j = {
				bodyA: this.body,
				bodyB: body,
				length: props.length != undefined ? props.length / plScale : null,
				frequencyHz: props.frequencyHz,
				dampingRatio: props.dampingRatio,
				collideConnected: props.collideConnected,
				maxLength: props.maxLength != undefined ? props.maxLength / plScale : null,
				userData: props.userData,
				lengthA: props.lengthA != undefined ? props.lengthA / plScale : null,
				lengthB: props.lengthB != undefined ? props.lengthB / plScale : null,
				ratio: props.ratio,
				groundAnchorA: props.groundAnchorA ? scaleTo(props.groundAnchorA) : new pl.Vec2(0, 0),
				groundAnchorB: props.groundAnchorB ? scaleTo(props.groundAnchorB) : new pl.Vec2(0, 0),
				enableLimit: props.enableLimit,
				enableMotor: props.enableMotor,
				lowerAngle: props.lowerAngle,
				maxMotorTorque: props.maxMotorTorque,
				maxMotorForce: props.maxMotorForce,
				motorSpeed: props.motorSpeed,
				referenceAngle: props.referenceAngle,
				upperAngle: props.upperAngle,
				maxForce: props.maxForce,
				maxTorque: props.maxTorque,
				localAxisA: props.localAxisA,
				upperTranslation: props.upperTranslation ? props.upperTranslation / plScale : 1,
				lowerTranslation: props.lowerTranslation ? props.lowerTranslation / plScale : 1,
				angularOffset: props.angularOffset,
				joint1: props.joint1,
				joint2: props.joint2,
				correctionFactor: props.correctionFactor,
				linearOffset: props.linearOffset ? scaleTo(props.linearOffset) : new pl.Vec2(0, 0)
			};
			if (anchor) {
				j.localAnchorA = bodyA.body.getLocalPoint(scaleTo(anchor));
				j.localAnchorB = body.getLocalPoint(scaleTo(anchor));
			} else {
				j.localAnchorA = props.localAnchorA ? scaleTo(props.localAnchorA) : new pl.Vec2(0, 0);
				j.localAnchorB = props.localAnchorB ? scaleTo(props.localAnchorB) : new pl.Vec2(0, 0);
			}
			if (type == 'distance') {
				j = pl.DistanceJoint(j);
			} else if (type == 'pulley') {
				j = pl.PulleyJoint(j);
			} else if (type == 'wheel') {
				j = pl.WheelJoint(j);
			} else if (type == 'rope') {
				j = pl.RopeJoint(j);
			} else if (type == 'weld') {
				j = pl.WeldJoint(j);
			} else if (type == 'revolute') {
				j = pl.RevoluteJoint(j);
			} else if (type == 'gear') {
				j = pl.GearJoint(j);
			} else if (type == 'friction') {
				j = pl.FrictionJoint(j);
			} else if (type == 'motor') {
				j = pl.MotorJoint(j);
			} else if (type == 'prismatic') {
				j = pl.PrismaticJoint(j);
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
			return world.createJoint(j);
		}

		/**
		 * Checks if the the sprite is colliding with another sprite or a group.
		 * The check is performed using the sprite's physics body (colliders).
		 *
		 * A callback function can be specified to perform additional operations
		 * when contact occurs. If the target is a group the function will be called
		 * for each single sprite colliding. The parameter of the function are
		 * respectively the current sprite and the colliding sprite.
		 *
		 * @example
		 *     sprite.collide(otherSprite, explosion);
		 *
		 *     function explosion(spriteA, spriteB) {
		 *       spriteA.remove();
		 *       spriteB.score++;
		 *     }
		 *
		 * @method collide
		 * @param {Sprite|Group} target Sprite or group to check against the current one
		 * @param {Function} [callback] The function to be called if overlap is positive
		 */
		collide(target, callback) {
			this.collides[target] = callback || true;
		}

		/**
		 * Deprecated, use sprite.collide instead.
		 *
		 * @deprecated
		 * @method bounce
		 * @param {Sprite|Group} target
		 * @param {Function} callback
		 */
		bounce(target, callback) {
			this.collide(target, callback);
		}

		/**
		 * Deprecated, use sprite.collide instead.
		 *
		 * @deprecated
		 * @method displace
		 * @param {Sprite|Group} target
		 * @param {Function} callback
		 */
		displace(target, callback) {
			this.collide(target, callback);
		}

		/**
		 * Checks if this sprite is overlapping with another sprite or a group.
		 * The check is performed using the sprite's physics body (colliders).
		 *
		 * A callback function can be specified to perform additional operations
		 * when contact occurs. If the target is a group the function will be called
		 * for each single sprite overlapping. The parameters of the callback function
		 * are the current sprite and the overlapping sprite.
		 *
		 * Since v3, this function only needs to be called once, it doesn't need to be
		 * used in the p5.js draw loop.
		 *
		 * @example
		 *   sprite.overlap(otherSprite, pickup);
		 *
		 *   function pickup(spriteA, spriteB) {
		 *     spriteA.remove();
		 *     spriteB.itemCount++;
		 *   }
		 *
		 * @method overlap
		 * @param {Sprite|Group} target Sprite or group to check against the current one
		 * @param {Function} [callback] The function to be called if an overlap occurs
		 */
		overlap(target, callback) {
			if (!this.sensor) {
				let shape;
				for (let fxt = this.fixtureList; fxt; fxt = fxt.getNext()) {
					shape = fxt.m_shape;
					break;
				}

				this.sensor = this.body.createFixture({
					shape: shape,
					isSensor: true
				});
			}

			this.overlaps[target] = callback || true;
			return this.touching[target];
		}

		/**
		 * Use sprite.animation.name instead.
		 *
		 * @deprecated
		 * @returns the name of the sprite's current animation
		 */
		getAnimationLabel() {
			return this.animation.name;
		}
	}

	/**
	 * A SpriteAnimation object contains a series of images (p5.Image objects)
	 * that can be displayed sequentially.
	 *
	 * A sprite can have multiple labeled animations, see Sprite.addAnimation
	 * and Sprite.changeAnimation, but you can also create animations that
	 * can be used without being added to a sprite first.
	 *
	 * An animation can be created either from a list of images or sequentially
	 * numbered images. p5.play will try to detect the sequence pattern.
	 *
	 * For example if the image file path is "image1.png" and the last frame
	 * index is 3 then "image2.png" and "image3.png" will be loaded as well.
	 *
	 * @example
	 *
	 * let shapeShifter = new SpriteAnimation("dog.png", "cat.png", "snake.png");
	 * let walking = new SpriteAnimation("walking0001.png", 5);
	 *
	 * @class SpriteAnimation
	 * @constructor
	 */
	class SpriteAnimation {
		constructor() {
			this.p = pInst;
			let args = [...arguments];

			/**
			 * The name of the animation
			 *
			 * @property name
			 * @type {String}
			 */
			this.name = 'default';

			if (typeof args[0] == 'string' && !args[0].includes('.')) {
				this.name = args[0];
				args = args.slice(1);
			}

			/**
			 * Array of frames (p5.Image)
			 *
			 * @property images
			 * @type {Array}
			 */
			this.images = [];

			/**
			 * The index of the current frame that the animation is on.
			 *
			 * @property frame
			 * @type {Number}
			 */
			this.frame = 0;

			this.cycles = 0;

			this.targetFrame = -1;

			/**
			 * The offset is how far the animation should be placed from
			 * the location it is played at.
			 *
			 * @property offset
			 * @type {Object} x and y keys
			 *
			 * @example
			 * offset.x = 16;
			 */
			this.offset = { x: 0, y: 0 };

			/**
			 * Delay between frames in number of draw cycles.
			 * If set to 4 the framerate of the animation would be the
			 * sketch framerate divided by 4 (60fps = 15fps)
			 *
			 * @property frameDelay
			 * @type {Number}
			 * @default 4
			 */
			this.frameDelay = 4;

			/**
			 * True if the animation is currently playing.
			 *
			 * @property playing
			 * @type {Boolean}
			 * @default true
			 */
			this.playing = true;

			/**
			 * Animation visibility.
			 *
			 * @property visible
			 * @type {Boolean}
			 * @default true
			 */
			this.visible = true;

			/**
			 * If set to false the animation will stop after reaching the last frame
			 *
			 * @property looping
			 * @type {Boolean}
			 * @default true
			 */
			this.looping = true;

			/**
			 * True if frame changed during the last draw cycle
			 *
			 * @property frameChanged
			 * @type {Boolean}
			 */
			this.frameChanged = false;

			//sequence mode
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
					throw new Error('SpriteAnimation error: you need to use .png files (filename ' + from + ')');
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
					this.images.push(this.p.loadImage(from));
					this.images.push(this.p.loadImage(to));
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
							this.images.push(this.p.loadImage(fileName));
						}
					} // case: case img1, img2
					else {
						for (let i = num1; i <= num2; i++) {
							// Use nf() to number format 'i' into four digits
							fileName = prefix1 + i + '.png';
							this.images.push(this.p.loadImage(fileName));
						}
					}
				}
			} // end sequence mode
			// Sprite sheet mode
			else if (args.length == 1 && args[0] instanceof SpriteSheet) {
				this.spriteSheet = args[0];
				this.images = this.spriteSheet.frames;
			} else if (args.length != 0) {
				// arbitrary list of images
				for (let i = 0; i < args.length; i++) {
					if (args[i] instanceof p5.Image) this.images.push(args[i]);
					else this.images.push(this.p.loadImage(args[i]));
				}
			}
		}

		/**
		 * Use offset.x
		 *
		 * @deprecated
		 */
		get offX() {
			return this.offset.x;
		}
		set offX(val) {
			this.offset.x = val;
		}
		/**
		 * Use offset.y
		 *
		 * @deprecated
		 */
		get offY() {
			return this.offset.y;
		}
		set offY(val) {
			this.offset.y = val;
		}

		/**
		 * Objects are passed by reference so to have different sprites
		 * using the same animation you need to clone it.
		 *
		 * @private
		 * @return {SpriteAnimation} A clone of the current animation
		 */
		clone() {
			var myClone = new SpriteAnimation(); //empty
			myClone.images = [];

			if (this.spriteSheet) {
				myClone.spriteSheet = this.spriteSheet.clone();
			}
			myClone.images = this.images.slice();

			myClone.offset.x = this.offset.x;
			myClone.offset.y = this.offset.y;
			myClone.frameDelay = this.frameDelay;
			myClone.playing = this.playing;
			myClone.looping = this.looping;

			return myClone;
		}

		/**
		 * Draws the animation at coordinate x and y.
		 * Updates the frames automatically.
		 *
		 * @method draw
		 * @param {Number} x x coordinate
		 * @param {Number} y y coordinate
		 * @param {Number} [r=0] rotation
		 */
		draw(x, y, r) {
			this.x = x;
			this.y = y;
			this.rotation = r || 0;

			if (!this.visible) return;
			//only connection with the sprite class
			//if animation is used independently draw and update are the sam
			if (!this.isSpriteAnimation) this.update();

			this.p.push();
			this.p.imageMode(p5.prototype.CENTER);
			this.p.translate(this.x, this.y);
			this.p.rotate(this.rotation);
			if (this.images[this.frame] !== undefined) {
				if (this.spriteSheet) {
					let frame_info = this.images[this.frame].frame;

					this.p.image(
						this.spriteSheet.image,
						this.offset.x,
						this.offset.y,
						frame_info.width,
						frame_info.height,
						frame_info.x,
						frame_info.y,
						frame_info.width,
						frame_info.height
					);
				} else {
					this.p.image(this.images[this.frame], this.offset.x, this.offset.y);
				}
			} else {
				this.p.print('Warning undefined frame ' + this.frame);
				//this.isActive = false;
			}

			this.p.pop();
		}

		/**
		 * @private
		 */
		update() {
			this.cycles++;
			var previousFrame = this.frame;
			this.frameChanged = false;

			//go to frame
			if (this.images.length === 1) {
				this.playing = false;
				this.frame = 0;
			}

			if (this.playing && this.cycles % this.frameDelay === 0) {
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
					if (this.frame >= this.lastFrame) this.frame = 0;
					else this.frame++;
				} else {
					//if next frame is too high
					if (this.frame < this.lastFrame) this.frame++;
				}
			}
			if (
				this.onComplete &&
				((this.targetFrame == -1 && this.frame == this.lastFrame) || this.frame == this.targetFrame)
			) {
				if (this.looping) this.targetFrame = -1;
				this.onComplete(); //fire when on last frame
			}

			if (previousFrame !== this.frame) this.frameChanged = true;
		} //end update

		/**
		 * Plays the animation.
		 *
		 * @method play
		 */
		play() {
			this.playing = true;
			this.targetFrame = -1;
		}

		/**
		 * Stops the animation.
		 *
		 * @method stop
		 */
		stop() {
			this.playing = false;
		}

		/**
		 * Plays the animation backwards.
		 * Equivalent to ani.goToFrame(0)
		 *
		 * @method rewind
		 */
		rewind() {
			this.goToFrame(0);
		}

		/**
		 * fire when animation ends
		 *
		 * @method onComplete
		 * @return {SpriteAnimation}
		 */
		onComplete() {
			return undefined;
		}

		/**
		 * Deprecated, change the frame property directly.
		 *
		 * Changes the current frame.
		 *
		 * @deprecated
		 * @param {Number} frame Frame number (starts from 0).
		 */
		changeFrame(f) {
			if (f < this.images.length) this.frame = f;
			else this.frame = this.images.length - 1;

			this.targetFrame = -1;
			//this.playing = false;
		}

		/**
		 * Goes to the next frame and stops.
		 *
		 * @method nextFrame
		 */
		nextFrame() {
			if (this.frame < this.images.length - 1) this.frame = this.frame + 1;
			else if (this.looping) this.frame = 0;

			this.targetFrame = -1;
			this.playing = false;
		}

		/**
		 * Goes to the previous frame and stops.
		 *
		 * @method previousFrame
		 */
		previousFrame() {
			if (this.frame > 0) this.frame = this.frame - 1;
			else if (this.looping) this.frame = this.images.length - 1;

			this.targetFrame = -1;
			this.playing = false;
		}

		/**
		 * Plays the animation forward or backward toward a target frame.
		 *
		 * @method goToFrame
		 * @param {Number} toFrame Frame number destination (starts from 0)
		 */
		goToFrame(toFrame) {
			if (toFrame < 0 || toFrame >= this.images.length) {
				return;
			}

			// targetFrame gets used by the update() method to decide what frame to
			// select next.  When it's not being used it gets set to -1.
			this.targetFrame = toFrame;

			if (this.targetFrame !== this.frame) {
				this.playing = true;
			}
		}

		/**
		 * Use .frame instead.
		 *
		 * Returns the current frame number.
		 *
		 * @deprecated
		 * @return {Number} Current frame (starts from 0)
		 */
		getFrame() {
			return this.frame;
		}

		/**
		 * Use .lastFrame instead.
		 *
		 * Returns the last frame number.
		 *
		 * @deprecated
		 * @return {Number} Last frame number (starts from 0)
		 */
		getLastFrame() {
			return this.lastFrame;
		}

		get lastFrame() {
			return this.images.length - 1;
		}

		/**
		 * Returns the current frame image as p5.Image.
		 *
		 * @method getFrameImage
		 * @return {p5.Image} Current frame image
		 */
		getFrameImage() {
			return this.images[this.frame];
		}

		/**
		 * Returns the frame image at the specified frame number.
		 *
		 * @method getImageAt
		 * @param {Number} frame Frame number
		 * @return {p5.Image} Frame image
		 */
		getImageAt(f) {
			return this.images[f];
		}

		/**
		 * Use .w or .width instead.
		 *
		 * Returns the current frame width in pixels.
		 * If there is no image loaded, returns 1.
		 *
		 * @deprecated
		 * @method getWidth
		 * @return {Number} Frame width
		 */
		getWidth() {
			return this.width;
		}

		get w() {
			return this.width;
		}

		get width() {
			if (this.images[this.frame] instanceof p5.Image) {
				return this.images[this.frame].width;
			} else if (this.images[this.frame]) {
				// Special case: Animation-from-spritesheet treats its images array differently.
				return this.images[this.frame].frame.width;
			}
			return 1;
		}

		/**
		 * Use .h or .height instead.
		 *
		 * Returns the current frame height in pixels.
		 * If there is no image loaded, returns 1.
		 *
		 * @deprecated
		 * @return {Number} Frame height
		 */
		getHeight() {
			return this.height;
		}

		get h() {
			return this.height;
		}

		get height() {
			if (this.images[this.frame] instanceof p5.Image) {
				return this.images[this.frame].height;
			} else if (this.images[this.frame]) {
				// Special case: Animation-from-spritesheet treats its images array differently.
				return this.images[this.frame].frame.height;
			}
			return 1;
		}
	}

	/**
	 * Represents a sprite sheet and all it's frames.  To be used with SpriteAnimation,
	 * or static drawing single frames.
	 *
	 *  There are two different ways to load a SpriteSheet
	 *
	 * 1. Given width, height that will be used for every frame and the
	 *    number of frames to cycle through. The sprite sheet must have a
	 *    uniform grid with consistent rows and columns.
	 *
	 * 2. Given an array of frame objects that define the position and
	 *    dimensions of each frame.  This is Flexible because you can use
	 *    sprite sheets that don't have uniform rows and columns.
	 *
	 * @example
	 *     // Method 1 - Using width, height for each frame and number of frames
	 *     explode_sprite_sheet = loadSpriteSheet('assets/explode_sprite_sheet.png', 171, 158, 11);
	 *
	 *     // Method 2 - Using an array of objects that define each frame
	 *     var player_frames = loadJSON('assets/tiles.json');
	 *     player_sprite_sheet = loadSpriteSheet('assets/player_spritesheet.png', player_frames);
	 *
	 * @class SpriteSheet
	 * @constructor
	 * @param image String image path or p5.Image object
	 */
	class SpriteSheet {
		constructor() {
			this.p = pInst;
			var spriteSheetArgs = arguments;

			this.image = null;
			this.frames = [];
			this.frame_width = 0;
			this.frame_height = 0;
			this.num_frames = 0;

			if (spriteSheetArgs.length === 2 && Array.isArray(spriteSheetArgs[1])) {
				this.frames = spriteSheetArgs[1];
				this.num_frames = this.frames.length;
			} else if (
				spriteSheetArgs.length === 4 &&
				typeof spriteSheetArgs[1] === 'number' &&
				typeof spriteSheetArgs[2] === 'number' &&
				typeof spriteSheetArgs[3] === 'number'
			) {
				this.frame_width = spriteSheetArgs[1];
				this.frame_height = spriteSheetArgs[2];
				this.num_frames = spriteSheetArgs[3];
			}

			if (spriteSheetArgs[0] instanceof p5.Image) {
				this.image = spriteSheetArgs[0];
				if (spriteSheetArgs.length === 4) {
					this._generateSheetFrames();
				}
			} else {
				if (spriteSheetArgs.length === 2) {
					this.image = this.p.loadImage(spriteSheetArgs[0]);
				} else if (spriteSheetArgs.length === 4) {
					this.image = this.p.loadImage(spriteSheetArgs[0], this._generateSheetFrames.bind(this));
				}
			}
		}

		/**
		 * Generate the frames data for this sprite sheet based on user params
		 *
		 * @private
		 */
		_generateSheetFrames() {
			var sX = 0,
				sY = 0;
			for (var i = 0; i < this.num_frames; i++) {
				this.frames.push({
					name: i,
					frame: {
						x: sX,
						y: sY,
						width: this.frame_width,
						height: this.frame_height
					}
				});
				sX += this.frame_width;
				if (sX >= this.image.width) {
					sX = 0;
					sY += this.frame_height;
					if (sY >= this.image.height) {
						sY = 0;
					}
				}
			}
		}

		/**
		 * Draws a specific frame to the canvas.
		 *
		 * @method drawFrame
		 * @param frame_name  Can either be a string name, or a numeric index.
		 * @param x   x position to draw the frame at
		 * @param y   y position to draw the frame at
		 * @param [width]   optional width to draw the frame
		 * @param [height]  optional height to draw the frame
		 */
		drawFrame(frame_name, x, y, width, height) {
			var frameToDraw;
			if (typeof frame_name === 'number') {
				frameToDraw = this.frames[frame_name].frame;
			} else {
				for (var i = 0; i < this.frames.length; i++) {
					if (this.frames[i].name === frame_name) {
						frameToDraw = this.frames[i].frame;
						break;
					}
				}
			}
			var dWidth = width || frameToDraw.width;
			var dHeight = height || frameToDraw.height;

			this.p.image(
				this.image,
				x,
				y,
				dWidth,
				dHeight,
				frameToDraw.x,
				frameToDraw.y,
				frameToDraw.width,
				frameToDraw.height
			);
		}

		/**
		 * Objects are passed by reference so to have different sprites
		 * using the same animation you need to clone it.
		 *
		 * @return {SpriteSheet} A clone of the current SpriteSheet
		 */
		clone() {
			var myClone = new SpriteSheet(); //empty

			// Deep clone the frames by value not reference
			for (var i = 0; i < this.frames.length; i++) {
				var frame = this.frames[i].frame;
				var cloneFrame = {
					name: frame.name,
					frame: {
						x: frame.x,
						y: frame.y,
						width: frame.width,
						height: frame.height
					}
				};
				myClone.frames.push(cloneFrame);
			}

			// clone other fields
			myClone.image = this.image;
			myClone.frame_width = this.frame_width;
			myClone.frame_height = this.frame_height;
			myClone.num_frames = this.num_frames;

			return myClone;
		}
	}

	/**
	 * In p5.play groups are collections of sprites with similar behavior.
	 * For example a group may contain all the coin sprites that the
	 * player can collect.
	 *
	 * Group extends Array. You can use them in for loops just like arrays
	 * since they inherit all the properties of standard arrays such as
	 * group.length
	 *
	 * Since groups contain only references, a sprite can be in multiple
	 * groups and deleting a group doesn't affect the sprites themselves.
	 *
	 * sprite.remove() removes the sprite from all the groups
	 * it belongs to.
	 *
	 * @class Group
	 * @constructor
	 */
	class Group extends Array {
		constructor(...args) {
			super(...args);
			this.p = pInst;

			/**
			 * Keys are the animation label, values are SpriteAnimation objects.
			 *
			 * @property animations
			 * @type {Object}
			 */
			this.animations = {};

			/**
			 * Contains all the collision callback functions for this sprite
			 * when it comes in contact with other sprites or groups.
			 * @property collides
			 */
			this.collides = {};

			/**
			 * Contains all the overlap callback functions for this sprite
			 * when it comes in contact with other sprites or groups.
			 * @property overlaps
			 */
			this.overlaps = {};

			// mainly for internal use
			// shouldCull as a property of allSprites only refers to the default allSprites cull
			// in the post draw function, if the user calls cull on allSprites it should work
			// for any other group made by users shouldCull affects whether cull removes sprites or not
			// by default for allSprites it is set to true, for all other groups it is undefined
			this.shouldCull;

			this.shape;

			this.idNum = groupCount++;

			if (world) world.groups.push(this);
		}

		get debug() {
			return this._debug;
		}

		set debug(val) {
			for (let s of this) {
				s.debug = val;
			}
			this._debug = val;
		}

		/**
		 * The default layer for sprites in the group.
		 *
		 * @property layer
		 */
		get layer() {
			return this._layer;
		}

		set layer(val) {
			for (let s of this) {
				s.layer = val;
			}
			this._layer = val;
		}

		group() {
			return this.subGroup();
		}

		subGroup() {
			let g = new Group();
			let traits = Object.assign({}, this);
			let deletes = ['groupID', 'p', 'length', 'collides', 'overlaps'];
			for (let d of deletes) {
				delete traits[d];
			}
			for (let prop in traits) {
				if (!isNaN(prop)) continue;
				if (typeof traits[prop] == 'object') {
					g[prop] = Object.assign({}, traits[prop]);
				} else {
					g[prop] = traits[prop];
				}
			}
			return g;
		}

		sprite() {
			let s = new Sprite(this, ...arguments);
			let traits = Object.assign({}, this);

			let deletes = ['groupID', 'p', 'length', 'collides', 'overlaps', 'animation', 'animations'];
			for (let d of deletes) {
				delete traits[d];
			}
			for (let prop in traits) {
				if (!isNaN(prop)) continue;
				if (typeof traits[prop] == 'object') {
					s[prop] = Object.assign({}, traits[prop]);
				} else {
					s[prop] = traits[prop];
				}
			}
			return s;
		}

		createSprite() {
			return this.sprite(...arguments);
		}

		addAni(name, atlas) {
			// if (typeof name != 'string') {
			// 	atlas = name;
			// 	name = 'default' + this.animations.length;
			// }
			if (Array.isArray(atlas)) {
				atlas = { pos: atlas };
			}
			let { size, pos, line, frames, frameDelay } = atlas;
			size ??= this.tileSize || world.tileSize;
			pos ??= line || 0;
			let sheet = this.spriteSheet || world.spriteSheet;
			this.addAnimation(name, createAni(sheet, size, pos, frames, frameDelay));
		}

		addImg(name, atlas) {
			this.addAni(name, atlas);
		}

		addAnis(atlases) {
			for (let name in atlases) {
				let atlas = atlases[name];
				this.addAni(name, atlas);
			}
		}

		// group.snap = function (o, dist) {
		// 		if (o.isMoving) return;
		// 		dist ??= 1;
		// 		for (let i = 0; i < this.length; i++) {
		// 			let sprite = this[i];
		// 			let row = (sprite.y - _this.y) / sprite.w;
		// 			let col = (sprite.x - _this.x) / sprite.h;
		// 			if (Math.abs(row) % 1 >= dist || Math.abs(col) % 1 >= dist) continue;
		// 			row = Math.round(row);
		// 			col = Math.round(col);
		// 			sprite._row = row;
		// 			sprite._col = col;
		// 			sprite.velocity.x = 0;
		// 			sprite.velocity.y = 0;
		// 			sprite.y = _this.y + row * sprite.w;
		// 			sprite.x = _this.x + col * sprite.h;
		// 		}
		// 	};

		/**
		 * Checks if a sprite in the group is colliding with another sprite or a group.
		 * The check is performed using the sprite's physics body (colliders).
		 *
		 * A callback function can be specified to perform additional operations
		 * when contact occurs. If the target is a group the function will be called
		 * for each single sprite colliding. The parameter of the function are
		 * respectively the current sprite and the colliding sprite.
		 *
		 * Since v3, this function only needs to be called once, it doesn't need to be
		 * used in the p5.js draw loop.
		 *
		 * @example
		 *     group.collide(otherSprite, explosion);
		 *
		 *     function explosion(spriteA, spriteB) {
		 *       spriteA.remove();
		 *       spriteB.score++;
		 *     }
		 *
		 * @method collide
		 * @param {Sprite|Group} target Sprite or group to check against the current one
		 * @param {Function} [callback] The function to be called when a collision occurs
		 */
		collide(target, callback) {
			this.collides[target] = callback || true;
		}

		/**
		 * Deprecated, use group.collide instead.
		 *
		 * @deprecated
		 * @method bounce
		 * @param {Sprite|Group} target
		 * @param {Function} callback
		 */
		bounce(target, callback) {
			this.collide(target, callback);
		}

		/**
		 * Deprecated, use group.collide instead.
		 *
		 * @deprecated
		 * @method displace
		 * @param {Sprite|Group} target
		 * @param {Function} callback
		 */
		displace(target, callback) {
			this.collide(target, callback);
		}

		/**
		 * Checks if a sprite in the group is overlapping with another sprite or a group.
		 * The check is performed using the sprite's physics body (colliders).
		 *
		 * A callback function can be specified to perform additional operations
		 * when contact occurs. If the target is a group the function will be called
		 * for each single sprite overlapping. The parameter of the function are
		 * respectively the current sprite and the overlapping sprite.
		 *
		 * Since v3, this function only needs to be called once, it doesn't need to be
		 * used in the p5.js draw loop.
		 *
		 * @example
		 *     group.overlap(otherSprite, pickup);
		 *
		 *     function pickup(spriteA, spriteB) {
		 *       spriteA.remove();
		 *       spriteB.itemCount++;
		 *     }
		 *
		 * @method overlap
		 * @param {Sprite|Group} target Sprite or group to check against the current one
		 * @param {Function} [callback] The function to be called if overlap is positive
		 */
		overlap(target, callback) {
			this.overlaps[target] = callback || true;
		}

		/**
		 * Gets the member at index i.
		 *
		 * @deprecated
		 * @method get
		 * @param {Number} i The index of the object to retrieve
		 */
		get(i) {
			return this[i];
		}

		/**
		 * Checks if the group contains a sprite.
		 *
		 * @method contains
		 * @param {Sprite} sprite The sprite to search
		 * @return {Number} Index or -1 if not found
		 */
		contains(sprite) {
			return this.indexOf(sprite) > -1;
		}

		/**
		 * Adds a sprite to the group. Returns true if the sprite was added
		 * because it was not already in the group.
		 *
		 * @method push
		 * @param {Sprite} s The sprite to be added
		 */
		push(s) {
			if (!(s instanceof Sprite)) {
				throw new Error('you can only add sprites to a group');
			}

			if (-1 === this.indexOf(s)) {
				super.push(s);
				s.groups.push(this);
				return true;
			}
		}

		/**
		 * Adds a sprite to the group. Returns true if the sprite was added
		 * because it was not already in the group.
		 *
		 * @method add
		 * @param {Sprite} s The sprite to be added
		 */
		add(s) {
			this.push(s);
		}

		/**
		 * Same as group.length
		 *
		 * @method size
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
		 * Remove sprites that go outside the culling boundary
		 *
		 * @method cull
		 * @param {Number} top|size The distance that sprites can move below the p5.js canvas before they are removed. *OR* The distance sprites can travel outside the screen on all sides before they get removed.
		 * @param {Number} bottom|cb The distance that sprites can move below the p5.js canvas before they are removed.
		 * @param {Number} [left] The distance that sprites can move beyond the left side of the p5.js canvas before they are removed.
		 * @param {Number} [right] The distance that sprites can move beyond the right side of the p5.js canvas before they are removed.
		 * @param {Function} [cb(sprite)] The callback is given the sprite that
		 * passed the cull boundary, if no callback is given the sprite is
		 * removed by default
		 */
		cull(top, bottom, left, right, cb) {
			if (this.shouldCull === false && !this._isAllSpritesGroup) return;

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

			let minX = -left;
			let minY = -top;
			let maxX = this.p.width + right;
			let maxY = this.p.height + bottom;

			for (let s of this) {
				if (s.x < minX || s.y < minY || s.x > maxX || s.y > maxY) {
					if (cb) cb(s);
					else s.remove();
				}
			}

			// no need to cull allSprites again post draw
			// if the user used cull on allSprites to redefine the cull boundary
			if (this._isAllSpritesGroup) this.shouldCull = false;
		}

		/**
		 * Removes all the sprites in the group
		 * from the scene.
		 *
		 * @method removeSprites
		 */
		removeSprites() {
			this.removeAll();
		}

		/**
		 * Removes all the sprites in the group
		 * from the scene.
		 *
		 * @method removeAll
		 */
		removeAll() {
			while (this.length > 0) {
				this[0].remove();
			}
		}

		/**
		 * Removes a sprite from the group.
		 * Does not remove the actual sprite, only the reference.
		 *
		 * @method remove
		 * @param {Sprite} item The sprite to be removed
		 * @return {Boolean} true if sprite was found and removed
		 */
		remove(item) {
			if (!(item instanceof Sprite)) {
				throw new TypeError('you can only remove sprites from a group');
			}

			var i,
				removed = false;
			for (i = this.length - 1; i >= 0; i--) {
				if (this[i] === item) {
					this.splice(i, 1);
					removed = true;
				}
			}

			if (removed) {
				for (i = item.groups.length - 1; i >= 0; i--) {
					if (item.groups[i] === this) {
						item.groups.splice(i, 1);
					}
				}
			}

			return removed;
		}

		/**
		 * Returns the highest depth in a group
		 *
		 * @method maxDepth
		 * @return {Number} The depth of the sprite drawn on the top
		 */
		maxDepth() {
			if (this.length == 0) return 0;
			if (this.length == 1 && this[0].depth === undefined) return 0;

			return this.reduce(function (maxDepth, sprite) {
				return Math.max(maxDepth, sprite.depth);
			}, -Infinity);
		}

		/**
		 * Returns the lowest depth in a group
		 *
		 * @method minDepth
		 * @return {Number} The depth of the sprite drawn on the bottom
		 */
		minDepth() {
			if (this.length === 0) {
				return 99999;
			}

			return this.reduce(function (minDepth, sprite) {
				return Math.min(minDepth, sprite.depth);
			}, Infinity);
		}

		/**
		 * Adds an image to the Group.
		 * An image will be considered a one-frame animation.
		 * The image should be preloaded in the preload() function using p5 loadImage.
		 * Animations require a identifying label (string) to change them.
		 * The image is stored in the Group but not necessarily displayed
		 * until Sprite.changeAnimation(label) is called
		 *
		 * Usages:
		 * - group.addImage(label, image);
		 * - group.addImage(image);
		 *
		 * If only an image is passed no label is specified
		 *
		 * @method addImage
		 * @param {String|p5.Image} label Label or image
		 * @param {p5.Image} [img] Image
		 */
		addImage() {
			let args = arguments;
			if (typeof args[0] === 'string' && args[1] instanceof p5.Image) {
				this.addAnimation(args[0], args[1]);
			} else if (args[0] instanceof p5.Image) {
				this.addAnimation('default', args[0]);
			} else {
				throw new TypeError('only accepts a p5.image or an image label string followed by a p5.image)');
			}
		}

		/**
		 * Adds an animation to the group. This function should be used in
		 * the preload p5.js function. You don't need to name the animation if
		 * the sprites in the group will only use one animation. See SpriteAnimation
		 * for more information.
		 *
		 * Uses:
		 * - group.addAnimation(label, animation);
		 * - group.addAnimation(label, firstFrame, lastFrame);
		 * - group.addAnimation(label, frame1, frame2, frame3...);
		 *
		 * @method addAnimation
		 * @param {String} label SpriteAnimation identifier
		 * @param {SpriteAnimation} animation The preloaded animation
		 */
		addAnimation() {
			let args = [...arguments];
			let name, anim;
			if (args[0] instanceof SpriteAnimation) {
				anim = args[0].clone();
				name = anim.name || 'default';
				anim.name = name;
			} else if (args[1] instanceof SpriteAnimation) {
				name = args[0];
				anim = args[1].clone();
				anim.name = name;
			} else {
				anim = new SpriteAnimation(...args);
				name = anim.name;
			}
			anim.isSpriteAnimation = true;
			this.animations[name] = anim;
			if (!this.animation) {
				this.animation = anim;
			}
			return anim;
		}

		draw() {
			this.p.push();
			this.p.imageMode(p5.prototype.CENTER);
			this.p.rectMode(p5.prototype.CENTER);
			this.p.ellipseMode(p5.prototype.CENTER);
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
				if (sprite.visible) sprite.display();
			}
			this.p.pop();
		}
	}

	/**
	 * World
	 */
	class World extends pl.World {
		constructor(gravityX, gravityY, tileSize) {
			super(new pl.Vec2(gravityX || 0, gravityY || 0), true);
			this.p = pInst;
			this.width = this.p.width;
			this.height = this.p.height;
			this.tileSize = tileSize || 1;
			this._offset = { x: 0, y: 0 };
			let _this = this;
			this.offset = {
				get x() {
					return -_this._offset.x;
				},
				/**
				 * @property offset.x
				 */
				set x(val) {
					_this._offset.x -= val;
					_this.origin.x -= val;
				},
				get y() {
					return -_this._offset.y;
				},
				/**
				 * @property offset.y
				 */
				set y(val) {
					_this._offset.y -= val;
					_this.origin.y -= val;
				}
			};
			this.resize();
			this.spriteSheet;
			this.groups = [this.p.allSprites];
			this.on('begin-contact', this._beginContact);
			this.on('end-contact', this._endContact);
			world = this;
		}

		resize() {
			this.origin = {
				x: this.p.width * 0.5,
				y: this.p.height * 0.5
			};
			if (this.tileSize != 1) {
				this.origin.x -= this.tileSize * 0.5 + this.offset.x;
				this.origin.y -= this.tileSize * 0.5 + this.offset.y;
			}
		}

		_beginContact(contact) {
			// Get both fixtures
			let a = contact.m_fixtureA;
			let b = contact.m_fixtureB;

			let contactType = 'collides';
			if (a.isSensor() || b.isSensor()) contactType = 'overlaps';

			a = a.m_body.sprite;
			b = b.m_body.sprite;

			a.touching[b] = true;
			b.touching[a] = true;

			// log(a, b);
			let cb = _findContactCB(contactType, a, b);
			if (cb) {
				contacts.push([cb, a, b]);
				return;
			}
			cb = _findContactCB(contactType, b, a);
			if (cb) contacts.push([cb, b, a]);
		}

		_endContact(contact) {
			let a = contact.m_fixtureA.m_body.sprite;
			let b = contact.m_fixtureB.m_body.sprite;
			a.touching[b] = false;
			b.touching[a] = false;
		}

		get gravity() {
			return this.m_gravity;
		}
		/**
		 * Gravity vector
		 * @property gravity
		 */
		set gravity(val) {
			this.setGravity(val);
		}

		createTiles(tiles, x, y, w, h) {
			if (typeof tiles == 'string') tiles = tiles.split('\n');

			x ??= 0;
			y ??= 0;

			for (let row = 0; row < tiles.length; row++) {
				for (let col = 0; col < tiles[row].length; col++) {
					let t = tiles[row][col];
					if (t == ' ') continue;
					let anim, g;
					for (g of this.groups) {
						anim = g.animations[t];
						if (anim) break;
					}
					if (!anim) throw new Error("Couldn't find tile: " + t);
					g.createSprite(anim, x + col, y + row, w, h);
				}
			}
		}
	}

	/**
	 *
	 * @private
	 * @param {String} type "collides" or "overlaps"
	 * @param {Sprite} s0
	 * @param {Sprite} s1
	 * @returns contact cb if one can be found between the two sprites
	 */
	function _findContactCB(type, s0, s1) {
		let cb = s0[type][s1];
		if (cb) return cb;

		for (let g1 of s1.groups) {
			cb = s0[type][g1];
			if (cb) return cb;
		}

		for (let g0 of s0.groups) {
			cb = g0[type][s1];
			if (cb) return cb;
			for (let g1 of s1.groups) {
				cb = g0[type][g1];
				if (cb) return cb;
			}
		}
		return false;
	}

	pl.Fixture.prototype.shouldCollide = function (that) {
		// should this and that collide?
		let a = this;
		let b = that;

		if (a.isSensor() || b.isSensor()) return true;

		a = a.m_body.sprite;
		b = b.m_body.sprite;

		let cb = _findContactCB('overlaps', a, b);
		if (!cb) cb = _findContactCB('overlaps', b, a);
		if (cb) return false;
		return true;
	};

	/**
	 * @method createTiles
	 * @param {String|Array} tiles String or array of strings
	 */
	p5.prototype.createTiles = function (tiles) {
		world.createTiles(tiles);
	};

	/**
	 * This function is automatically called at the end of the p5.js draw
	 * loop, unless it was already called in the draw loop.
	 *
	 * @method updateSprites
	 * @param {Number} timeStep
	 * @param {Number} velocityIterations
	 * @param {Number} positionIterations
	 */
	p5.prototype.updateSprites = function (timeStep, velocityIterations, positionIterations) {
		if (!world) world = new World();

		for (let s of this.allSprites) {
			s.previousPosition.x = s.x;
			s.previousPosition.y = s.y;
		}

		// 2nd and 3rd arguments are velocity and position iterations
		world.step(timeStep || 1 / 60, velocityIterations || 8, positionIterations || 3);

		for (let c of contacts) {
			if (typeof c[0] == 'function') {
				c[0](c[1], c[2]);
			}
		}
		contacts = [];

		for (let s of this.allSprites) {
			s.update();
		}

		this._p5play.autoUpdateSprites = false;
	};

	/**
	 * Returns the sprite at
	 *
	 * @method getSpriteAt
	 * @param {Number} x
	 * @param {Number} y
	 * @returns
	 */
	p5.prototype.getSpriteAt = function (x, y) {
		const convertedPoint = new pl.Vec2(x / plScale, y / plScale);
		const aabb = new pl.AABB();
		aabb.lowerBound = new pl.Vec2(convertedPoint.x - 0.001, convertedPoint.y - 0.001);
		aabb.upperBound = new pl.Vec2(convertedPoint.x + 0.001, convertedPoint.y + 0.001);

		// Query the world for overlapping shapes.
		let selectedFxt = null;
		world.queryAABB(aabb, (fxt) => {
			if (!fxt.getBody().isStatic()) {
				if (fxt.getShape().testPoint(fxt.getBody().getTransform(), convertedPoint)) {
					selectedFxt = fxt;
					return false;
				}
			}
			return true;
		});
		if (selectedFxt) {
			for (let s of allSprites) {
				if (selectedFxt == s.body.m_fixtureList) {
					return s;
				}
			}
		}
		return null;
	};

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

	function getAABB(body) {
		const aabb = new pl.AABB();
		const t = new pl.Transform();
		t.setIdentity();
		const shapeAABB = new pl.AABB();
		aabb.lowerBound = new pl.Vec2(1000000, 1000000);
		aabb.upperBound = new pl.Vec2(-1000000, -1000000);
		let fixture = body.body.getFixtureList();
		while (fixture) {
			const shape = fixture.getShape();
			const childCount = shape.getChildCount(); //only for chains
			for (let child = 0; child < childCount; ++child) {
				shape.computeAABB(shapeAABB, body.body.m_xf, child);
				unionTo(aabb, shapeAABB);
			}
			fixture = fixture.getNext();
		}
		aabb.lowerBound.mul(plScale); //upper left, offset from center
		aabb.upperBound.mul(plScale); //lower right
		return aabb;
	}

	function unionTo(a, b) {
		a.lowerBound.x = min(a.lowerBound.x, b.lowerBound.x);
		a.lowerBound.y = min(a.lowerBound.y, b.lowerBound.y);
		a.upperBound.x = max(a.upperBound.x, b.upperBound.x);
		a.upperBound.y = max(a.upperBound.y, b.upperBound.y);
	}

	// The ray cast collects multiple hits along the ray in ALL mode.
	// The fixtures are not necessary reported in order.
	// We might not capture the closest fixture in ANY.
	const rayCast = (() => {
		let def = {
			ANY: 0,
			NEAREST: 2,
			ALL: 1
		};

		const reset = (mode, ignore) => {
			def.points = [];
			def.normals = [];
			def.fixtures = [];
			def.fractions = [];
			def.ignore = ignore || [];
			def.mode = mode == undefined ? def.NEAREST : mode;
		};

		def.rayCast = (point1, point2, mode, ignore) => {
			reset(mode, ignore);
			world.rayCast(scaleTo(point1), scaleTo(point2), def.callback);
		};

		def.callback = (fixture, point, normal, fraction) => {
			if (def.ignore.length > 0) for (let i = 0; i < def.ignore.length; i++) if (def.ignore[i] === fixture) return -1;
			if (def.mode == def.NEAREST && def.points.length == 1) {
				def.fixtures[0] = fixture;
				def.points[0] = scaleFrom(point);
				def.normals[0] = normal;
				def.fractions[0] = fraction;
			} else {
				def.fixtures.push(fixture);
				def.points.push(scaleFrom(point));
				def.normals.push(normal);
				def.fractions.push(fraction);
			}
			// -1 to ignore a fixture and continue
			//  0 to terminate on first hit, or for searching
			//  fraction seems to return nearest fixture as last entry in array
			// +1 returns multiple but mix of low high or high low
			return def.mode == def.NEAREST ? fraction : def.mode;
		};

		return def;
	})();

	const queryAABB = (() => {
		let def = {};
		function reset(search) {
			def.fixtures = [];
			def.search = search || [];
		}

		def.query = ({ lowerBound, upperBound }, search) => {
			reset(search);
			aabbc = new pl.AABB(lowerBound.mul(1 / plScale), upperBound.mul(1 / plScale));
			world.queryAABB(aabbc, def.callback);
		};

		def.callback = (fixture) => {
			def.fixtures.push(fixture);
			return true;
		};

		return def;
	})();

	/**
	 * Gets a color from a color palette
	 *
	 * @method colorPal
	 * @param {String} c A single character, a key found in the color palette object.
	 * @param {Number|Object} palette Can be a palette object or number index
	 * in the system's palettes array.
	 * @returns a hex color string for use by p5.js functions
	 */
	p5.prototype.colorPal = (c, palette) => {
		if (typeof palette == 'number') {
			palette = world.palettes[palette];
		}
		palette ??= world.palettes[0];
		c = palette[c];
		if (!c) return color(0, 0, 0, 0);
		return color(c);
	};

	/**
	 * Create pixel art images from a string. Each character in the
	 * input string represents a color value defined in the palette
	 * object.
	 *
	 * @method spriteArt
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
	p5.prototype.spriteArt = (txt, scale, palette) => {
		scale ??= 1;
		if (typeof palette == 'number') {
			palette = world.palettes[palette];
		}
		palette ??= world.palettes[0];
		let lines = txt; // accepts 2D arrays of characters
		if (typeof txt == 'string') {
			txt = txt.replace(/^[\n\t]+|\s+$/g, ''); // trim newlines
			lines = txt.split('\n');
		}
		let w = 0;
		for (let line of lines) {
			if (line.length > w) w = line.length;
		}
		let h = lines.length;
		let img = createImage(w * scale, h * scale);
		img.loadPixels();

		for (let i = 0; i < lines.length; i++) {
			for (let j = 0; j < lines[i].length; j++) {
				for (let sX = 0; sX < scale; sX++) {
					for (let sY = 0; sY < scale; sY++) {
						let c = colorPal(lines[i][j], palette);
						img.set(j * scale + sX, i * scale + sY, c);
					}
				}
			}
		}
		img.updatePixels();
		return img; // return the p5 graphics object
	};

	/**
	 * This function is called automatically at the end of the p5.js draw
	 * loop unless it was already called in the draw loop.
	 *
	 * @method drawSprites
	 * @param {Group} group of sprites, allSprites by default
	 */
	p5.prototype.drawSprites = function (group) {
		group ??= this.allSprites;
		group.draw();
		this._p5play.autoDrawSprites = false;
	};

	/**
	 * Creates a new sprite.
	 *
	 * @returns {Sprite}
	 */
	p5.prototype.createSprite = function () {
		return new Sprite(...arguments);
	};

	/**
	 * Creates a new group of sprites.
	 *
	 * @returns {Group}
	 */
	p5.prototype.createGroup = function () {
		return new Group(...arguments);
	};

	/**
	 * Loads a Sprite Sheet.
	 * Use this in the preload p5.js function.
	 *
	 * @method loadSpriteSheet
	 * @returns {SpriteSheet}
	 */
	p5.prototype.loadSpriteSheet = function () {
		return new SpriteSheet(...arguments);
	};

	/**
	 * Loads an animation.
	 * Use this in the preload p5.js function.
	 *
	 * @method loadAnimation
	 * @returns {SpriteAnimation}
	 */
	p5.prototype.loadAnimation = function () {
		return new SpriteAnimation(...arguments);
	};

	/**
	 * TODO fix this function
	 *
	 * @param {p5.Image} spriteSheetImg
	 * @param {Number|Array} size
	 * @param {Array} pos
	 * @param {Number} frameCount
	 * @param {Number} frameDelay
	 * @returns a SpriteAnimation
	 */
	p5.prototype.createAni = function (spriteSheetImg, size, pos, frameCount, frameDelay) {
		let w, h;
		if (typeof size == 'number') {
			w = size;
			h = size;
		} else {
			w = size[0];
			h = size[1];
		}

		// add all the frames in the animation to the frames array
		let frames = [];
		frameCount ??= 1; // set frameCount to 1 by default
		for (let i = 0; i < frameCount; i++) {
			let x, y;
			// if pos is a number, that means it's just a line number
			// and the animation's first frame is at x = 0
			// the line number is the location of the animation line
			// given as a distance in tiles from the top of the image
			if (typeof pos == 'number') {
				x = w * i;
				y = h * pos;
			} else {
				// pos is the location of the animation line
				// given as a [row,column] coordinate pair of distances in tiles
				// from the top left corner of the image
				x = w * (i + pos[1]); // column
				y = h * pos[0]; // row
			}

			frames.push({
				frame: { x: x, y: y, width: w, height: h }
			});
		}
		let ani = loadAnimation(loadSpriteSheet(spriteSheetImg, frames));
		if (typeof frameDelay != 'undefined') ani.frameDelay = frameDelay;
		return ani;
	};

	/**
	 * Displays an animation. Similar to the p5.js image function.
	 *
	 * @method animation
	 * @param {SpriteAnimation} anim Animation to be displayed
	 * @param {Number} x X coordinate
	 * @param {Number} y Y coordinate
	 *
	 */
	p5.prototype.animation = function (anim, x, y) {
		anim.draw(x, y);
	};

	/**
	 * Delay
	 *
	 * @param {Number} millisecond
	 * @returns {Promise} A Promise that fulfills after the specified time.
	 *
	 * @example
	 * async function startGame() {
	 *   await delay(3000);
	 * }
	 */
	p5.prototype.delay = (millisecond) => {
		// if no input arg given, delay waits for the next possible animation frame
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
	 * Delay
	 *
	 * @param {Number} millisecond
	 * @returns {Promise} A Promise that fulfills after the specified time.
	 *
	 * @example
	 * async function startGame() {
	 *   await sleep(3000);
	 * }
	 */
	p5.prototype.sleep = (millisecond) => {
		return this.delay(millisecond);
	};

	/**
	 * Awaitable function for playing sounds.
	 *
	 * @method play
	 * @param {p5.Sound} sound
	 * @returns {Promise}
	 */
	p5.prototype.play = (sound) => {
		// TODO reject if sound not found
		return new Promise((resolve, reject) => {
			sound.play();
			sound.onended(() => {
				resolve();
			});
		});
	};

	let keyCodes = {
		_: 189,
		'-': 189,
		',': 188,
		';': 188,
		':': 190,
		'!': 49,
		'?': 219,
		'.': 190,
		'"': 50,
		'(': 56,
		')': 57,
		'§': 51,
		'*': 187,
		'/': 55,
		'&': 54,
		'#': 191,
		'%': 53,
		'°': 220,
		'+': 187,
		'=': 48,
		"'": 191,
		$: 52,
		Alt: 18,
		ArrowUp: 38,
		ArrowDown: 40,
		ArrowLeft: 37,
		ArrowRight: 39,
		CapsLock: 20,
		Clear: 12,
		Control: 17,
		Delete: 46,
		Escape: 27,
		Insert: 45,
		PageDown: 34,
		PageUp: 33,
		Shift: 16,
		Tab: 9
	};

	/**
	 * Get the keyCode of a key
	 *
	 * @method getKeyCode
	 * @param {string} keyName
	 * @returns {number} keyCode
	 */
	function getKeyCode(keyName) {
		if (typeof keyName != 'string') return keyName;
		let code = keyCodes[keyName];
		if (code) return code;
		return keyName.toUpperCase().charCodeAt(0);
	}

	let userDisabledP5Errors = p5.disableFriendlyErrors;
	p5.disableFriendlyErrors = true;

	// keyIsDown is a p5.js function
	let _keyIsDown = this.keyIsDown;

	/**
	 * Check if key is down.
	 *
	 * @method keyIsDown
	 * @param {string} keyName
	 * @returns {boolean} true if key is down
	 */
	this.keyIsDown = function (keyName) {
		return _keyIsDown.call(pInst, getKeyCode(keyName));
	};

	/**
	 * Use keyIsDown instead.
	 *
	 * @deprecated
	 */
	this.isKeyDown = function (keyName) {
		return pInst.keyIsDown(keyName);
	};

	/**
	 * Use keyIsDown instead.
	 *
	 * @deprecated
	 */
	this.keyDown = function (keyName) {
		return pInst.keyIsDown(keyName);
	};

	const _createCanvas = this.createCanvas;

	this.createCanvas = function () {
		let args = [...arguments];
		if (args.length < 2) {
			args[0] = 100;
			args[1] = 100;
		}
		if (args.length < 3) {
			args[2] = 'p2d';
		}
		_createCanvas.call(pInst, ...args);
		if (world) world.resize();
		if (!userDisabledP5Errors) p5.disableFriendlyErrors = false;
	};

	const _background = this.background;

	/**
	 * Just like the p5.js background function except it also accepts
	 * a color pallette code.
	 *
	 * @method background
	 */
	this.background = function () {
		let args = arguments;

		if (typeof args[0] == 'string' && args[0].length == 1) {
			_background.call(this, colorPal(args[0]));
		} else {
			_background.call(this, ...args);
		}
	};

	const _fill = this.fill;

	/**
	 * Just like the p5.js fill function except it also accepts
	 * a color pallette code.
	 *
	 * @method fill
	 */
	this.fill = function () {
		let args = arguments;

		if (typeof args[0] == 'string' && args[0].length == 1) {
			_fill.call(this, colorPal(args[0]));
		} else {
			_fill.call(this, ...args);
		}
	};

	const _stroke = this.stroke;

	/**
	 * Just like the p5.js stroke function except it also accepts
	 * a color pallette code.
	 *
	 * @method stroke
	 */
	this.stroke = function () {
		let args = arguments;

		if (typeof args[0] == 'string' && args[0].length == 1) {
			_stroke.call(this, colorPal(args[0]));
		} else {
			_stroke.call(this, ...args);
		}
	};

	this.Sprite = Sprite;
	this.SpriteAnimation = SpriteAnimation;
	this.SpriteSheet = SpriteSheet;
	this.Group = Group;
	this.World = World;

	/**
	 * A group of all the sprites.
	 *
	 * @property allSprites
	 */
	this.allSprites = new Group();
	this.allSprites._isAllSpritesGroup = true;
	this.allSprites.shouldCull = true;
});

p5.prototype.registerMethod('post', function p5playPostDraw() {
	this.centerX ??= this.width * 0.5;
	this.centerY ??= this.height * 0.5;

	if (!this.allSprites.length) return;

	if (this._p5play.autoDrawSprites) {
		this.drawSprites();
		this._p5play.autoDrawSprites = true;
	}

	if (this._p5play.autoUpdateSprites) {
		this.updateSprites();
		this._p5play.autoUpdateSprites = true;
	}
});
