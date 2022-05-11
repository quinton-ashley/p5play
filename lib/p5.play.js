/*
p5.play v3

Upgraded and maintained by Quinton Ashley @quinton-ashley, 2022
https://quintos.org

p5.play was founded by Paolo Pedercini @molleindustria, 2015
https://molleindustria.org/
*/
p5.prototype.registerMethod('init', function p5PlayInit() {
	const log = console.log; // shortcut

	// store a reference the p5 instance that p5play is being added to
	let pInst = this;

	const pl = planck;

	const abs = p5.prototype.abs;
	const radians = p5.prototype.radians;
	const dist = p5.prototype.dist;
	const degrees = p5.prototype.degrees;
	const pow = p5.prototype.pow;
	const round = p5.prototype.round;

	let world;
	let plScale = 60;
	let contacts = [];

	const scaleTo = ({ x, y }) => new pl.Vec2(x / plScale, y / plScale);
	const scaleFrom = ({ x, y }) => new pl.Vec2(x * plScale, y * plScale);

	p5.prototype.updateSprites = function (timeScale, velocityStep, positionStep) {
		// 2nd and 3rd arguments are velocity and position iterations
		world.step(timeScale || 1 / 60, velocityStep || 8, positionStep || 3);
		if (contacts.length == 0) return;
		for (let i = 0; i < contacts.length; i += 2) {
			/*052121*/
			if (contacts[i].m_body.m_userData.body.m_collision != null) {
				contacts[i].m_body.m_userData.body.m_collision(contacts[i], contacts[i + 1]);
			} else if (contacts[i + 1].m_body.m_userData.body.m_collision != null) {
				contacts[i + 1].m_body.m_userData.body.m_collision(contacts[i + 1], contacts[i]);
			}
		}
		contacts = [];
	};

	// ContactListener for collisions!
	function contactListener(contact) {
		// Get both fixtures
		const f1 = contact.getFixtureA();
		const f2 = contact.getFixtureB();
		// Get both bodies
		const b1 = f1.m_body.m_userData.body;
		if (!b1.body.isActive()) return;
		const b2 = f2.m_body.m_userData.body;
		if (!b2.body.isActive()) return;
		if (b1.collision == null && b2.collision == null) return;
		contacts.push(f1, f2);
	}

	function getFixtureAt(x, y) {
		const mouseInWorld = new pl.Vec2(x / plScale, y / plScale);
		const aabb = new pl.AABB();
		aabb.lowerBound = new new pl.Vec2(mouseInWorld.x - 0.001, mouseInWorld.y - 0.001)();
		aabb.upperBound = new new pl.Vec2(mouseInWorld.x + 0.001, mouseInWorld.y + 0.001)();

		// Query the world for overlapping shapes.

		let selectedBody = null;
		world.queryAABB(aabb, (fixture) => {
			if (!fixture.getBody().isStatic()) {
				if (fixture.getShape().testPoint(fixture.getBody().getTransform(), mouseInWorld)) {
					selectedBody = fixture;
					return false;
				}
			}
			return true;
		});
		return selectedBody;
	}

	// -----------------------------------------------------------------------------
	// Draw Methods
	// -----------------------------------------------------------------------------

	const debugDraw = (canvas, scale, world) => {
		const context = canvas.getContext('2d');
		//context.fillStyle = '#DDD';
		//context.fillRect(0, 0, canvas.width, canvas.height);

		// Draw joints
		for (let j = world.m_jointList; j; j = j.m_next) {
			context.lineWidth = 0.25;
			context.strokeStyle = '#00F';
			drawJoint(context, scale, world, j);
		}
	};

	const drawJoint = (context, scale, world, joint) => {
		context.save();
		context.scale(scale, scale);
		context.lineWidth /= scale;

		const b1 = joint.m_bodyA;
		const b2 = joint.m_bodyB;
		const x1 = b1.getPosition();
		const x2 = b2.getPosition();
		let p1;
		let p2;
		context.beginPath();
		switch (joint.m_type) {
			case 'distance-joint':
			case 'rope-joint':
				context.moveTo(x1.x, x1.y);
				context.lineTo(x2.x, x2.y);
				break;
			case 'wheel-joint':
			case 'revolute-joint':
				p1 = joint.m_localAnchorA;
				p2 = joint.m_localAnchorB;
				const a = b2.getAngle();
				const v = new pl.Vec2(cos(a), sin(a));
				context.moveTo(x2.x, x2.y);
				context.lineTo(x2.x + v.x, x2.y + v.y);
				break;
			case 'mouse-joint':
			case 'weld-joint':
				p1 = joint.getAnchorA();
				p2 = joint.getAnchorB();
				context.moveTo(p1.x, p1.y);
				context.lineTo(p2.x, p2.y);
				break;
			case 'pulley-joint':
				p1 = joint.m_groundAnchorA;
				p2 = joint.m_groundAnchorB;
				context.moveTo(p1.x, p1.y);
				context.lineTo(x1.x, x1.y);
				context.moveTo(p2.x, p2.y);
				context.lineTo(x2.x, x2.y);
				context.moveTo(p1.x, p1.y);
				context.lineTo(p2.x, p2.y);
				break;
			default:
				break;
		}
		context.closePath();
		context.stroke();
		context.restore();
	};

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

	p5.prototype.drawSprites = function (group) {
		group ??= allSprites;
		this.push();
		this.imageMode(p5.prototype.CENTER);
		this.rectMode(p5.prototype.CENTER);
		this.ellipseMode(p5.prototype.CENTER);
		this.angleMode(p5.prototype.RADIANS);

		for (let i = 0; i < group.length; i++) {
			if (!group[i].body.isActive()) {
				world.destroyBody(group[i].body);
				group[i] = group[group.length - 1];
				group.pop();
				continue;
			}
			const pos = group[i].position;
			if (pos.x < world.x || pos.x > world.x + world.width) {
				group[i].destroy();
				continue;
			}
			if (pos.y < world.y || pos.y > world.y + world.height) {
				group[i].destroy();
				continue;
			}
			if (group[i].life-- < 0) {
				group[i].destroy();
				continue;
			}
			if (!group[i].visible) continue;

			const x = width / 2 - world.origin.x + pos.x;
			const y = height / 2 - world.origin.y + pos.y;
			if (x < -100 || x > width + 100 || y < -100 || y > height + 100) {
				// we skip drawing for out-of-view bodies, but
				// edges can be very long, so added exclusion
				if (group[i].fixture.getType() != 'chain') continue;
			}
			this.translate(x, y);
			const a = group[i].body.getAngle();
			if (a != 0) rotate(a);
			if (group[i].display) {
				this.push();
				group[i].display.call(group[i]);
				this.pop();
			} else group[i].draw();
			this.resetMatrix();
		}
		// if (debug) debugDraw(this.canvas, plScale, world);
		this.pop();
	};

	// function b2Destroy() {
	// 	for (var i = 0; i < allSprites.length; i++) {
	// 		world.destroyBody(allSprites[i].body);
	// 	}
	// 	allSprites = [];
	// }

	const getBodyFromFixture = ({ m_body }) => m_body.m_userData.body;

	/**
	 * A Sprite is the main building block of p5.play:
	 * an element able to store images or animations with a set of
	 * properties such as position and visibility.
	 * A Sprite can have a collider that defines the active area to detect
	 * collisions or overlappings with other sprites and mouse interactions.
	 *
	 * Sprites are added to the allSprites group and given a depth value that
	 * puts it in front of all other sprites by default.
	 *
	 * Rectangle:
	 * new Sprite(x, y, w, h, type)
	 *
	 * Circle:
	 * new Sprite(x, y, r, type)
	 *
	 * Polygon/Chain:
	 * new Sprite(x, y, [length, angle, repeat], type);
	 *
	 * @class Sprite
	 * @constructor
	 * @param {Number} x Initial x coordinate
	 * @param {Number} y Initial y coordinate
	 * @param {Number} [width|radius] Width of the placeholder rectangle and of
	 * the collider until an image or new collider are set. *OR* If height is not
	 * set then this parameter becomes the radius of the placeholder circle.
	 * @param {Number} [height] Height of the placeholder rectangle and of the collider
	 * until an image or new collider are set createVector
	 */
	class Sprite {
		constructor(x, y, w, h, bodyType) {
			this.p = pInst;

			/**
			 * Groups the sprite belongs to, including allSprites
			 *
			 * @property groups
			 * @type {Array}
			 */
			this.groups = [];

			/**
			 * Keys are the animation label, values are SpriteAnimation objects.
			 *
			 * @property animations
			 * @type {Object}
			 */
			this.animations = {};

			/**
			 * The current animation's label.
			 *
			 * @property currentAnimation
			 * @type {String}
			 */
			this.currentAnimation = '';

			/**
			 * Reference to the current animation.
			 *
			 * @property animation
			 * @type {SpriteAnimation}
			 */
			this.animation = undefined;

			/**
			 * If false, animations that are stopped before they are completed,
			 * typically by a call to sprite.changeAnimation, will start at the frame
			 * they were stopped at. If true, animations will always start playing from
			 * frame 0 unless specified by the user in a seperate anim.changeFrame
			 * call.
			 *
			 * @property autoResetAnimations
			 * @type {SpriteAnimation}
			 */
			this.autoResetAnimations = false;

			let ani, path, shape;
			if (typeof x != 'number') {
				// shift
				ani = x;
				x = y;
				y = w;
				if (ani instanceof p5.Image) {
					bodyType = h;
					w = ani.width;
					h = ani.height;
					this.addImage(ani);
				} else {
					w = h;
					h = bodyType;
					bodyType = arguments[5];
				}
			}
			if (Array.isArray(w)) {
				// shift
				path = w;
				bodyType = h;
			} else {
				if (h === undefined) shape ??= 'circle';
				shape ??= 'box';
			}

			if (shape == 'box' || shape == 'circle') {
				w ??= 100;
				this.width = w;
				h ??= w;
				this.height = h;
				if (shape == 'circle') this.radius = w;
			}

			// if (props.image) this.m_image = props.image; /*RPC051521*/
			// if (props.imageResize) this.m_imageResize = props.imageResize;

			let props = {};

			let dimensions;
			if (shape == 'box' || shape == 'circle') {
				dimensions = scaleTo({ x: w, y: h });
			}

			let s;
			if (shape == 'box') {
				s = pl.Box(dimensions.x / 2, dimensions.y / 2, { x: 0, y: 0 }, 0);
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
				let ang = 0;
				for (let i = 0; i < rep; i++) {
					for (let j = 0; j < path.length - 1; j += 2) {
						let len = path[j];
						ang += path[j + 1];
						vert.x += len * cos(radians(ang));
						vert.y += len * sin(radians(ang));
						vecs.push({ x: vert.x, y: vert.y });
						if (vert.x < min.x) min.x = vert.x;
						if (vert.y < min.y) min.y = vert.y;
						if (vert.x > max.x) max.x = vert.x;
						if (vert.y > max.y) max.y = vert.y;
					}
				}
				if (
					Math.round(vert.x * 1e6) / 1e6 == 0 &&
					Math.round(vert.y * 1e6) / 1e6 == 0 &&
					vecs.length - 1 <= pl.Settings.maxPolygonVertices
				) {
					shape = 'polygon';
				} else {
					shape = 'edge';
				}
				this.w = max.x - min.x;
				this.h = max.y - min.y;
				for (let i = 0; i < vecs.length; i++) {
					let vec = vecs[i];
					vecs[i] = new pl.Vec2((vec.x - this._hw - min.x) / plScale, (vec.y - this._hh - min.y) / plScale);
				}
				if (shape == 'polygon') {
					s = pl.Polygon(vecs);
				} else if (shape == 'edge') {
					s = pl.Chain(vecs, false);
					props.density = 0;
					props.restitution = 0;
				}
			}
			// else if (shape == 'edge' || shape == 'chain') {
			// 	var vecs = [];
			// 	let j = wh.length;
			// 	let closed = false;
			// 	if (wh[0].x == wh[j - 1].x && wh[0].y == wh[j - 1].y) {
			// 		j--;
			// 		closed = true;
			// 	}
			// 	for (var i = 0; i < j; i++) {
			// 		w = b2scaleTo(wh[i]);
			// 		w.x += point.x;
			// 		w.y += point.y;
			// 		vecs[i] = w;
			// 	}
			// 	s = pl.Chain(vecs, closed);
			// 	props.density = 0;
			// 	props.restitution = 0;
			// }
			props.shape = s;
			props.density ??= 5;
			props.friction ??= 0.5;
			props.restitution ??= 0.2;

			this.body = world.createBody({
				position: scaleTo({ x, y }),
				type: bodyType || 'dynamic'
			});

			this.body.createFixture(props); /*RPC051521*/ /*RPC052521*/

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
			 */
			this.shapeColor = this.p.color(this.p.random(255), this.p.random(255), this.p.random(255));

			/**
			 * Called if the sprite overlaps with another sprite when checked with
			 * the overlap function.
			 *
			 * @property onOverlap
			 * @type {Function}
			 * @param {Sprite} other Receives the sprite that this sprite overlaps with.
			 */
			this.onOverlap;

			/**
			 * Called if the sprite collided with another sprite when checked with
			 * the collide function.
			 *
			 * @property onCollide
			 * @type {Function}
			 * @param {Sprite} other Receives the sprite that this sprite collided with.
			 */
			this.onCollide;

			/**
			 * Called if the sprite displaces another sprite when checked with
			 * the displace function.
			 *
			 * @property onDisplace
			 * @type {Function}
			 * @param {Sprite} other Receives the sprite that this sprite displaces.
			 */
			this.onDisplace;

			/**
			 * Called if the sprite bounced another sprite when checked with
			 * the bounce function.
			 *
			 * @property onBounce
			 * @type {Function}
			 * @param {Sprite} other Receives the sprite that this sprite bounced.
			 */
			this.onBounce;

			allSprites.push(this);
		}

		get aabb() {
			return getAABB(this);
		}
		get active() {
			return this.body.isActive();
		}
		set active(val) {
			this.body.setActive(val);
		}
		set advance(val) {
			this.body.advance(val);
		}
		get angle() {
			return this.body.getAngle();
		}
		set angle(val) {
			this.body.setAngle(val);
		}
		get rotation() {
			return this.angle;
		}
		set rotation(val) {
			this.angle = val;
		}
		get angularDamping() {
			return this.body.getAngularDamping();
		}
		set angularDamping(val) {
			this.body.setAngularDamping(val);
		}
		set angularImpulse(val) {
			this.body.applyAngularImpulse(val, true);
		}
		get angularVelocity() {
			return this.body.getAngularVelocity();
		}
		set angularVelocity(val) {
			this.body.setAngularVelocity(val);
		}
		get awake() {
			return this.body.isAwake();
		}
		set awake(val) {
			this.body.setAwake(val);
		}
		get bullet() {
			return this.body.isBullet();
		}
		set bullet(val) {
			this.body.setBullet(val);
		}
		get centerOfMass() {
			// offset from position
			return scaleFrom(this.body.getWorldCenter());
		}
		get collision() {
			return this.m_collision;
		}
		set collision(val) {
			this.m_collision = val;
			world.on('begin-contact', contactListener);
		}
		get density() {
			return this.body.m_fixtureList.getDensity();
		}
		set density(val) {
			for (let fxt = this.body.getFixtureList(); fxt; fxt = fxt.getNext()) {
				fxt.setDensity(val);
			}
		}
		get dynamic() {
			return this.body.isDynamic();
		}
		set dynamic(val) {
			if (val) this.body.setDynamic();
		}
		get filterCategoryBits() {
			return this.body.m_fixtureList.m_filterCategoryBits;
		}
		set filterCategoryBits(val) {
			for (let fxt = this.body.getFixtureList(); fxt; fxt = fxt.getNext()) {
				fxt.m_filterCategoryBits = val;
			}
		}
		get filterMaskBits() {
			return this.body.m_fixtureList.m_filterMaskBits;
		}
		set filterMaskBits(val) {
			for (let fxt = this.body.getFixtureList(); fxt; fxt = fxt.getNext()) {
				fxt.m_filterMaskBits = val;
			}
		}
		get filterGroupIndex() {
			return this.body.m_fixtureList.m_filterGroupIndex;
		}
		set filterGroupIndex(val) {
			for (let fxt = this.body.getFixtureList(); fxt; fxt = fxt.getNext()) {
				fxt.m_filterGroupIndex = val;
			}
		}
		get fixedRotation() {
			return this.body.isFixedRotation();
		}
		set fixedRotation(val) {
			this.body.setFixedRotation(val);
		}
		get fixtureList() {
			return this.body.getFixtureList();
		}
		get fixture() {
			return this.body.getFixtureList();
		}
		set force(val) {
			this.body.applyForceToCenter(val, true);
		}
		get friction() {
			return this.body.m_fixtureList.getFriction();
		}
		set friction(val) {
			for (let fxt = this.body.getFixtureList(); fxt; fxt = fxt.getNext()) {
				fxt.setFriction(val);
			}
		}
		get gravityScale() {
			return this.body.getGravityScale();
		}
		set gravityScale(val) {
			this.body.setGravityScale(val);
		}
		get image() {
			return this.m_image;
		}
		set image(val) {
			this.m_image = val;
		}
		/*RPC051521*/
		get imageResize() {
			return this.m_imageResize;
		}
		set imageResize(val) {
			this.m_imageResize = val;
		}
		set impulse(val) {
			this.body.applyLinearImpulse(val, this.body.getWorldCenter(), true);
		}
		get inertia() {
			return this.body.getInertia();
		}
		get joint() {
			return this.body.getJointList().joint;
		}
		get jointList() {
			return this.body.getJointList();
		}
		get kinematic() {
			return this.body.isKinematic();
		}
		set kinematic(val) {
			if (val) this.body.setKinematic();
		}
		get linearDamping() {
			return this.body.getLinearDamping();
		}
		set linearDamping(val) {
			this.body.setLinearDamping(val);
		}
		get linearVelocity() {
			return this.body.getLinearVelocity();
		}
		set linearVelocity(val) {
			this.body.setLinearVelocity(val);
		}
		get localCenter() {
			return scaleFrom(this.body.getLocalCenter());
		}
		get mass() {
			return this.body.getMass();
		}
		get massData() {
			const t = { I: 0, center: new pl.Vec2(0, 0), mass: 0 };
			this.body.getMassData(t);
			t.center = scaleFrom(t.center);
		}
		set massData(val) {
			val.center = scaleTo(val.center);
			this.body.setMassData(val);
		}
		get next() {
			return this.body.getNext();
		}
		get position() {
			return scaleFrom(this.body.getPosition());
		}
		set position(val) {
			this.body.setPosition(scaleTo(val));
		}
		get restitution() {
			return this.body.m_fixtureList.getRestitution();
		}
		set restitution(val) {
			for (let fxt = this.body.getFixtureList(); fxt; fxt = fxt.getNext()) {
				fxt.setRestitution(val);
			}
		}
		get sensor() {
			return this.body.m_fixtureList.isSensor();
		}
		set sensor(val) {
			for (let fxt = this.body.getFixtureList(); fxt; fxt = fxt.getNext()) {
				fxt.setSensor(val);
			}
		}
		get sleepingAllowed() {
			return this.body.isSleepingAllowed();
		}
		set sleepingAllowed(val) {
			this.body.setSleepingAllowed(val);
		}
		get static() {
			return this.body.isStatic();
		}
		set static(val) {
			if (val) this.body.setStatic();
		}
		set torque(val) {
			this.body.applyTorque(val, true);
		}
		get transform() {
			const t = this.body.getTransform();
			return { position: scaleFrom(t.p), angle: asin(t.q.s) };
		}
		set transform({ position, angle }) {
			this.body.setTransform(scaleTo(position), angle);
		}
		get userData() {
			return this.body.m_userData.user;
		}
		set userData(val) {
			this.body.m_userData.user = val;
		}
		get world() {
			return this.body.getWorld();
		}
		get worldCenter() {
			return scaleFrom(this.body.getWorldCenter());
		}
		get worldLocked() {
			return this.body.isWorldLocked();
		}

		get x() {
			return this.position.x;
		}
		set x(val) {
			this.position = new pl.Vec2(val, this.y);
		}
		get y() {
			return this.position.x;
		}
		set y(val) {
			this.position = new pl.Vec2(this.x, val);
		}
		get w() {
			return this._w;
		}
		set w(val) {
			this._w = val;
			this._hw = val * 0.5;
		}
		get width() {
			return this.w;
		}
		set width(val) {
			this.w = val;
		}
		get h() {
			return this._h;
		}
		set h(val) {
			this._h = val;
			this._hh = val * 0.5;
		}
		get height() {
			return this.h;
		}
		set height(val) {
			this.h = val;
		}
		get r() {
			this._radius ??= this.w;
			return this._radius;
		}
		set r(val) {
			this._radius = val;
			this.w = val;
			this.h = val;
		}
		get radius() {
			return this.r;
		}
		set radius(val) {
			this.r = val;
		}

		destroy() {
			this.body.setActive(false);
		}

		applyForce(force, position) {
			this.body.applyForce(force, scaleTo(position), true);
		}

		applyImpulse(force, position) {
			this.body.applyLinearImpulse(force, scaleTo(position), true);
		}

		destroyFixture(fxt) {
			this.body.destroyFixture(fxt);
		}

		velocityFromLocalPoint(point) {
			return this.body.getLinearVelocityFromLocalPoint(scaleTo(point));
		}

		velocityFromWorldPoint(point) {
			return this.body.getLinearVelocityFromWorldPoint(scaleTo(point));
		}

		localPoint(point) {
			return scaleFrom(this.body.getLocalPoint(scaleTo(point)));
		}

		localVector(vector) {
			return scaleFrom(this.body.getLocalVector(scaleTo(vector)));
		}

		worldPoint(point) {
			return scaleFrom(this.body.getWorldPoint(scaleTo(point)));
		}

		worldVector(vector) {
			return scaleFrom(this.body.getWorldVector(scaleTo(vector)));
		}

		shouldCollide(body) {
			return this.body.shouldCollide(body.body);
		}

		draw() {
			if (this.animation) {
				this.animation.draw(0, 0, 0);
				return;
			}
			for (let fxt = this.body.getFixtureList(); fxt; fxt = fxt.getNext()) {
				this.drawFixture(fxt);
			}
		}

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
			if (typeof arguments[0] === 'string' && arguments[1] instanceof p5.Image)
				this.addAnimation(arguments[0], arguments[1]);
			else if (arguments[0] instanceof p5.Image) this.addAnimation('normal', arguments[0]);
			else throw new TypeError('only accepts a p5.image or an image label string followed by a p5.image)');
		}

		/**
		 * Adds an animation to the sprite.
		 * The animation should be preloaded in the preload() function
		 * using loadAnimation.
		 * Animations require a identifying label (string) to change them.
		 * Animations are stored in the sprite but not necessarily displayed
		 * until Sprite.changeAnimation(label) is called.
		 *
		 * Usage:
		 * - sprite.addAnimation(label, animation);
		 *
		 * Alternative usages. See SpriteAnimation for more information on file sequences:
		 * - sprite.addAnimation(label, firstFrame, lastFrame);
		 * - sprite.addAnimation(label, frame1, frame2, frame3...);
		 *
		 * @method addAnimation
		 * @param {String} label SpriteAnimation identifier
		 * @param {SpriteAnimation} animation The preloaded animation
		 */
		addAnimation(label) {
			var anim;

			if (typeof label !== 'string') {
				this.p.print('Sprite.addAnimation error: the first argument must be a label (String)');
				return -1;
			} else if (arguments.length < 2) {
				this.p.print('addAnimation error: you must specify a label and n frame images');
				return -1;
			} else if (arguments[1] instanceof SpriteAnimation) {
				var sourceAnimation = arguments[1];

				var newAnimation = sourceAnimation.clone();

				this.animations[label] = newAnimation;

				if (this.currentAnimation === '') {
					this.currentAnimation = label;
					this.animation = newAnimation;
				}

				newAnimation.isSpriteAnimation = true;

				this.w = newAnimation.getWidth();
				this.h = newAnimation.getHeight();

				return newAnimation;
			} else {
				var animFrames = [];
				for (var i = 1; i < arguments.length; i++) animFrames.push(arguments[i]);

				anim = new SpriteAnimation(...animFrames);
				this.animations[label] = anim;

				if (this.currentAnimation === '') {
					this.currentAnimation = label;
					this.animation = anim;
				}
				anim.isSpriteAnimation = true;

				this.w = anim.getWidth();
				this.h = anim.getHeight();

				return anim;
			}
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
		changeAnimation(label) {
			let anim = this.animations[label];
			if (!anim) {
				for (let g of this.groups) {
					if (g.animations) anim = g.animations[label];
					if (anim) break;
				}
			}
			if (anim) {
				this.currentAnimation = label;
				this.animation = anim;
				// reset to frame 0 of that animation
				if (this.autoResetAnimations) this.animation.changeFrame(0);
			} else {
				this.p.print('changeAnimation error: no animation labeled ' + label);
			}
		}

		/**
		 * Removes the Sprite from the sketch.
		 * The removed Sprite won't be drawn or updated anymore.
		 *
		 * @method remove
		 */
		remove() {
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

		toString() {
			const v = this.body.getLinearVelocity();
			const xy = scaleFrom(this.body.getPosition());
			const a = degrees(this.body.getAngle()) % 360;
			return `xy=(${xy.x.toFixed()}, ${xy.y.toFixed()})\nv=(${v.x.toFixed(2)}, ${v.y.toFixed(2)})\na=${a.toFixed(2)}`;
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
	}

	/**
	 * An SpriteAnimation object contains a series of images (p5.Image) that
	 * can be displayed sequentially.
	 *
	 * All files must be png images. You must include the directory from the sketch root,
	 * and the extension .png
	 *
	 * A sprite can have multiple labeled animations, see Sprite.addAnimation
	 * and Sprite.changeAnimation, however an animation can be used independently.
	 *
	 * An animation can be created either by passing a series of file names,
	 * no matter how many or by passing the first and the last file name
	 * of a numbered sequence.
	 * p5.play will try to detect the sequence pattern.
	 *
	 * For example if the given filenames are
	 * "data/file0001.png" and "data/file0005.png" the images
	 * "data/file0003.png" and "data/file0004.png" will be loaded as well.
	 *
	 * @example
	 *     var sequenceAnimation;
	 *     var glitch;
	 *
	 *     function preload() {
	 *       sequenceAnimation = loadAnimation("data/walking0001.png", "data/walking0005.png");
	 *       glitch = loadAnimation("data/dog.png", "data/horse.png", "data/cat.png", "data/snake.png");
	 *     }
	 *
	 *     function setup() {
	 *       createCanvas(800, 600);
	 *     }
	 *
	 *     function draw() {
	 *       background(0);
	 *       animation(sequenceAnimation, 100, 100);
	 *       animation(glitch, 200, 100);
	 *     }
	 *
	 * @class SpriteAnimation
	 * @constructor
	 * @param {String} fileName1 First file in a sequence OR first image file
	 * @param {String} fileName2 Last file in a sequence OR second image file
	 * @param {String} [...fileNameN] Any number of image files after the first two
	 */
	class SpriteAnimation {
		constructor() {
			this.p = pInst;
			let frameArguments = arguments;

			/**
			 * Array of frames (p5.Image)
			 *
			 * @property images
			 * @type {Array}
			 */
			this.images = [];

			this.frame = 0;
			this.cycles = 0;
			this.targetFrame = -1;

			this.offX = 0;
			this.offY = 0;

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

			//is the collider defined manually or defined
			//by the current frame size
			this.imageCollider = false;

			//sequence mode
			if (
				frameArguments.length === 2 &&
				typeof frameArguments[0] === 'string' &&
				typeof frameArguments[1] === 'string'
			) {
				var from = frameArguments[0];
				var to = frameArguments[1];

				//print("sequence mode "+from+" -> "+to);

				//make sure the extensions are fine
				var ext1 = from.substring(from.length - 4, from.length);
				if (ext1 !== '.png') {
					this.p.print('SpriteAnimation error: you need to use .png files (filename ' + from + ')');
					from = -1;
				}

				var ext2 = to.substring(to.length - 4, to.length);
				if (ext2 !== '.png') {
					this.p.print('SpriteAnimation error: you need to use .png files (filename ' + to + ')');
					to = -1;
				}

				//extensions are fine
				if (from !== -1 && to !== -1) {
					var digits1 = 0;
					var digits2 = 0;

					//skip extension work backwards to find the numbers
					for (let i = from.length - 5; i >= 0; i--) {
						if (from.charAt(i) >= '0' && from.charAt(i) <= '9') digits1++;
						else break;
					}

					for (let i = to.length - 5; i >= 0; i--) {
						if (to.charAt(i) >= '0' && to.charAt(i) <= '9') digits2++;
						else break;
					}

					var prefix1 = from.substring(0, from.length - (4 + digits1));
					var prefix2 = to.substring(0, to.length - (4 + digits2));

					// Our numbers likely have leading zeroes, which means that some
					// browsers (e.g., PhantomJS) will interpret them as base 8 (octal)
					// instead of decimal. To fix this, we'll explicity tell parseInt to
					// use a base of 10 (decimal). For more details on this issue, see
					// http://stackoverflow.com/a/8763427/2422398.
					var number1 = parseInt(from.substring(from.length - (4 + digits1), from.length - 4), 10);
					var number2 = parseInt(to.substring(to.length - (4 + digits2), to.length - 4), 10);

					//swap if inverted
					if (number2 < number1) {
						var t = number2;
						number2 = number1;
						number1 = t;
					}

					//two different frames
					if (prefix1 !== prefix2) {
						//print("2 separate images");
						this.images.push(this.p.loadImage(from));
						this.images.push(this.p.loadImage(to));
					}
					//same digits: case img0001, img0002
					else {
						var fileName;
						if (digits1 === digits2) {
							//load all images
							for (let i = number1; i <= number2; i++) {
								// Use nf() to number format 'i' into four digits
								fileName = prefix1 + this.p.nf(i, digits1) + '.png';
								this.images.push(this.p.loadImage(fileName));
							}
						} //case: case img1, img2
						else {
							//print("from "+prefix1+" "+number1 +" to "+number2);
							for (let i = number1; i <= number2; i++) {
								// Use nf() to number format 'i' into four digits
								fileName = prefix1 + i + '.png';
								this.images.push(this.p.loadImage(fileName));
							}
						}
					}
				} //end no ext error
			} //end sequence mode
			// Sprite sheet mode
			else if (frameArguments.length === 1 && frameArguments[0] instanceof SpriteSheet) {
				this.spriteSheet = frameArguments[0];
				this.images = this.spriteSheet.frames;
			} else if (frameArguments.length !== 0) {
				//arbitrary list of images
				//print("Animation arbitrary mode");
				for (let i = 0; i < frameArguments.length; i++) {
					//print("loading "+fileNames[i]);
					if (frameArguments[i] instanceof p5.Image) this.images.push(frameArguments[i]);
					else this.images.push(this.p.loadImage(frameArguments[i]));
				}
			}
		}

		/**
		 * Objects are passed by reference so to have different sprites
		 * using the same animation you need to clone it.
		 *
		 * @method clone
		 * @return {SpriteAnimation} A clone of the current animation
		 */
		clone() {
			var myClone = new SpriteAnimation(); //empty
			myClone.images = [];

			if (this.spriteSheet) {
				myClone.spriteSheet = this.spriteSheet.clone();
			}
			myClone.images = this.images.slice();

			myClone.offX = this.offX;
			myClone.offY = this.offY;
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
			this.xpos = x;
			this.ypos = y;
			this.rotation = r || 0;

			if (this.visible) {
				//only connection with the sprite class
				//if animation is used independently draw and update are the sam
				if (!this.isSpriteAnimation) this.update();

				//this.currentImageMode = g.imageMode;
				this.p.push();
				this.p.imageMode(p5.prototype.CENTER);

				this.p.translate(this.xpos, this.ypos);
				if (this.p._angleMode === this.p.RADIANS) {
					this.p.rotate(radians(this.rotation));
				} else {
					this.p.rotate(this.rotation);
				}

				if (this.images[this.frame] !== undefined) {
					if (this.spriteSheet) {
						var frame_info = this.images[this.frame].frame;

						this.p.image(
							this.spriteSheet.image,
							this.offX,
							this.offY,
							frame_info.width,
							frame_info.height,
							frame_info.x,
							frame_info.y,
							frame_info.width,
							frame_info.height
						);
					} else {
						this.p.image(this.images[this.frame], this.offX, this.offY);
					}
				} else {
					this.p.print('Warning undefined frame ' + this.frame);
					//this.isActive = false;
				}

				this.p.pop();
			}
		}

		//called by draw
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
				//going to taget frame down
				else if (this.targetFrame < this.frame && this.targetFrame !== -1) {
					this.frame--;
				} else if (this.targetFrame === this.frame && this.targetFrame !== -1) {
					this.playing = false;
				} else if (this.looping) {
					//advance frame
					//if next frame is too high
					if (this.frame >= this.images.length - 1) this.frame = 0;
					else this.frame++;
				} else {
					//if next frame is too high
					if (this.frame < this.images.length - 1) this.frame++;
				}
			}
			if (
				this.onComplete &&
				((this.targetFrame == -1 && this.frame == this.images.length - 1) || this.frame == this.targetFrame)
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
		 * Rewinds the animation to the first frame.
		 *
		 * @method rewind
		 */
		rewind() {
			this.frame = 0;
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
		 * Changes the current frame.
		 *
		 * @method changeFrame
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
		 * Returns the current frame number.
		 *
		 * @method getFrame
		 * @return {Number} Current frame (starts from 0)
		 */
		getFrame() {
			return this.frame;
		}

		/**
		 * Returns the last frame number.
		 *
		 * @method getLastFrame
		 * @return {Number} Last frame number (starts from 0)
		 */
		getLastFrame() {
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
		 * Returns the current frame width in pixels.
		 * If there is no image loaded, returns 1.
		 *
		 * @method getWidth
		 * @return {Number} Frame width
		 */
		getWidth() {
			if (this.images[this.frame] instanceof p5.Image) {
				return this.images[this.frame].width;
			} else if (this.images[this.frame]) {
				// Special case: Animation-from-spritesheet treats its images array differently.
				return this.images[this.frame].frame.width;
			} else {
				return 1;
			}
		}

		/**
		 * Returns the current frame height in pixels.
		 * If there is no image loaded, returns 1.
		 *
		 * @method getHeight
		 * @return {Number} Frame height
		 */
		getHeight() {
			if (this.images[this.frame] instanceof p5.Image) {
				return this.images[this.frame].height;
			} else if (this.images[this.frame]) {
				// Special case: Animation-from-spritesheet treats its images array differently.
				return this.images[this.frame].frame.height;
			} else {
				return 1;
			}
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
		 * Generate the frames data for this sprite sheet baesd on user params
		 * @private
		 * @method _generateSheetFrames
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
		 * @param frame_name  Can either be a string name, or a numeric index.
		 * @param x   x position to draw the frame at
		 * @param y   y position to draw the frame at
		 * @param [width]   optional width to draw the frame
		 * @param [height]  optional height to draw the frame
		 * @method drawFrame
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
		 * @method clone
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
	 * Sprite.remove() removes the sprite from all the groups
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
			 * Checks if the the group is overlapping another group or sprite.
			 * The check is performed using the colliders. If colliders are not set
			 * they will be created automatically from the image/animation bounding box.
			 *
			 * A callback function can be specified to perform additional operations
			 * when the overlap occurs.
			 * The function will be called for each single sprite overlapping.
			 * The parameter of the function are respectively the
			 * member of the current group and the other sprite passed as parameter.
			 *
			 * @example
			 *     group.overlap(otherSprite, explosion);
			 *
			 *     function explosion(spriteA, spriteB) {
			 *       spriteA.remove();
			 *       spriteB.score++;
			 *     }
			 *
			 * @method overlap
			 * @param {Sprite|Group} target Group or Sprite to check against the current one
			 * @param {Function} [callback] The function to be called if overlap is positive
			 * @return {Boolean} True if overlapping
			 */
			this.overlap = this._groupCollide.bind(this, 'overlap');

			/**
			 * Checks if the the group is overlapping another group or sprite.
			 * If the overlap is positive the sprites in the group will be displaced
			 * by the colliding one to the closest non-overlapping positions.
			 *
			 * The check is performed using the colliders. If colliders are not set
			 * they will be created automatically from the image/animation bounding box.
			 *
			 * A callback function can be specified to perform additional operations
			 * when the overlap occours.
			 * The function will be called for each single sprite overlapping.
			 * The parameter of the function are respectively the
			 * member of the current group and the other sprite passed as parameter.
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
			 * @param {Sprite|Group} target Group or Sprite to check against the current one
			 * @param {Function} [callback] The function to be called if overlap is positive
			 * @return {Boolean} True if overlapping
			 */
			this.collide = this._groupCollide.bind(this, 'collide');

			/**
			 * Checks if the the group is overlapping another group or sprite.
			 * If the overlap is positive the sprites in the group will displace
			 * the colliding ones to the closest non-overlapping positions.
			 *
			 * The check is performed using the colliders. If colliders are not set
			 * they will be created automatically from the image/animation bounding box.
			 *
			 * A callback function can be specified to perform additional operations
			 * when the overlap occurs.
			 * The function will be called for each single sprite overlapping.
			 * The parameter of the function are respectively the
			 * member of the current group and the other sprite passed as parameter.
			 *
			 * @example
			 *     group.displace(otherSprite, explosion);
			 *
			 *     function explosion(spriteA, spriteB) {
			 *       spriteA.remove();
			 *       spriteB.score++;
			 *     }
			 *
			 * @method displace
			 * @param {Sprite|Group} target Group or Sprite to check against the current one
			 * @param {Function} [callback] The function to be called if overlap is positive
			 * @return {Boolean} True if overlapping
			 */
			this.displace = this._groupCollide.bind(this, 'displace');

			/**
			 * Checks if the the group is overlapping another group or sprite.
			 * If the overlap is positive the sprites will bounce affecting each
			 * other's trajectories depending on their .velocity, .mass and .restitution.
			 *
			 * The check is performed using the colliders. If colliders are not set
			 * they will be created automatically from the image/animation bounding box.
			 *
			 * A callback function can be specified to perform additional operations
			 * when the overlap occours.
			 * The function will be called for each single sprite overlapping.
			 * The parameter of the function are respectively the
			 * member of the current group and the other sprite passed as parameter.
			 *
			 * @example
			 *     group.bounce(otherSprite, explosion);
			 *
			 *     function explosion(spriteA, spriteB) {
			 *       spriteA.remove();
			 *       spriteB.score++;
			 *     }
			 *
			 * @method bounce
			 * @param {Sprite|Group} target Group or Sprite to check against the current one
			 * @param {Function} [callback] The function to be called if overlap is positive
			 * @return {Boolean} True if overlapping
			 */
			this.bounce = this._groupCollide.bind(this, 'bounce');

			// mainly for internal use
			// shouldCull as a property of allSprites only refers to the default allSprites cull
			// in the post draw function, if the user calls cull on allSprites it should work
			// for any other group made by users shouldCull affects whether cull removes sprites or not
			// by default for allSprites it is set to true, for all other groups it is undefined
			this.shouldCull;
		}

		/**
		 * Gets the member at index i.
		 *
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
		 * Same as Group.contains
		 * @method indexOf
		 */
		indexOf(item) {
			for (var i = 0, len = this.length; i < len; ++i) {
				if (this._virtEquals(item, this[i])) {
					return i;
				}
			}
			return -1;
		}

		/**
		 * Adds a sprite to the group. Returns true if the sprite was added
		 * because it was not already in the group.
		 *
		 * @method add
		 * @param {Sprite} s The sprite to be added
		 */
		add(s) {
			if (!(s instanceof Sprite)) {
				throw new Error('you can only add sprites to a group');
			}

			if (-1 === this.indexOf(s)) {
				this.push(s);
				s.groups.push(this);
				return true;
			}
		}

		/**
		 * Same as group.length
		 * @method size
		 */
		size() {
			return this.length;
		}

		/**
		 * Remove sprites that go outside the culling boundary
		 * @method cull
		 * @param {Number} top|size The distance that sprites can move below the p5.js canvas before they are removed. *OR* The distance sprites can travel outside the screen on all sides before they get removed.
		 * @param {Number} bottom|cb The distance that sprites can move below the p5.js canvas before they are removed.
		 * @param {Number} [left] The distance that sprites can move beyond the left side of the p5.js canvas before they are removed.
		 * @param {Number} [right] The distance that sprites can move beyond the right side of the p5.js canvas before they are removed.
		 * @param {Function} [cb] The function to be called if any sprites in the group are culled
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

			// prevent rebuilding the quadTree multiple times
			this.p.quadTree.rebuildOnRemove = false;
			let removed = new Group();
			for (let s of this) {
				if (s.position.x < minX || s.position.y < minY || s.position.x > maxX || s.position.y > maxY) {
					s.remove();
					removed.add(s);
				}
			}
			this.p.quadTree.rebuildOnRemove = true;

			if (removed.length) this.p.allSprites._rebuildQuadtree();

			// no need to cull allSprites again post draw
			// if the user used cull on allSprites to redefine the cull boundary
			if (this._isAllSpritesGroup) this.shouldCull = false;

			if (cb && removed.length) cb(removed);
		}

		/**
		 * Removes all the sprites in the group
		 * from the scene.
		 *
		 * @method removeSprites
		 */
		removeSprites() {
			while (this.length > 0) {
				this[0].remove();
			}
		}

		/**
		 * Removes a sprite from the group.
		 * Does not remove the actual sprite, only the affiliation (reference).
		 *
		 * @method remove
		 * @param {Sprite} item The sprite to be removed
		 * @return {Boolean} True if sprite was found and removed
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
			if (this.length === 0) {
				return 0;
			}

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
		 * Draws all the sprites in the group.
		 *
		 * @method draw
		 */
		draw() {
			//sort by depth
			this.sort(function (a, b) {
				return a.depth - b.depth;
			});

			for (var i = 0; i < this.size(); i++) {
				this.get(i).display();
			}
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
			if (typeof arguments[0] === 'string' && arguments[1] instanceof p5.Image)
				this.addAnimation(arguments[0], arguments[1]);
			else if (arguments[0] instanceof p5.Image) this.addAnimation('normal', arguments[0]);
			else throw new TypeError('only accepts a p5.image or an image label string followed by a p5.image)');
		}

		/**
		 * Adds an animation to the group.
		 * The animation should be preloaded in the preload() function
		 * using loadAnimation.
		 * Animations require a identifying label (string) to change them.
		 * Animations are stored in the group but not necessarily displayed
		 * until Sprite.changeAnimation(label) is called.
		 *
		 * Usage:
		 * - group.addAnimation(label, animation);
		 *
		 * Alternative usages. See SpriteAnimation for more information on file sequences:
		 * - group.addAnimation(label, firstFrame, lastFrame);
		 * - group.addAnimation(label, frame1, frame2, frame3...);
		 *
		 * @method addAnimation
		 * @param {String} label SpriteAnimation identifier
		 * @param {SpriteAnimation} animation The preloaded animation
		 */
		addAnimation(label) {
			var anim;

			if (typeof label !== 'string') {
				this.p.print('Sprite.addAnimation error: the first argument must be a label (String)');
				return -1;
			} else if (arguments.length < 2) {
				this.p.print('addAnimation error: you must specify a label and n frame images');
				return -1;
			} else if (arguments[1] instanceof SpriteAnimation) {
				var sourceAnimation = arguments[1];

				var newAnimation = sourceAnimation.clone();

				this.animations[label] = newAnimation;

				if (this.currentAnimation === '') {
					this.currentAnimation = label;
					this.animation = newAnimation;
				}

				newAnimation.isSpriteAnimation = true;

				return newAnimation;
			} else {
				var animFrames = [];
				for (var i = 1; i < arguments.length; i++) animFrames.push(arguments[i]);

				anim = new SpriteAnimation(...animFrames);
				this.animations[label] = anim;

				if (this.currentAnimation === '') {
					this.currentAnimation = label;
					this.animation = anim;
				}
				anim.isSpriteAnimation = true;

				return anim;
			}
		}

		//internal use
		_virtEquals(obj, other) {
			if (obj === null || other === null) {
				return obj === null && other === null;
			}
			if (typeof obj === 'string') {
				return obj === other;
			}
			if (typeof obj !== 'object') {
				return obj === other;
			}
			if (obj.equals instanceof Function) {
				return obj.equals(other);
			}
			return obj === other;
		}

		/**
		 * Collide each member of group against the target using the given collision
		 * type.  Return true if any collision occurred.
		 * Internal use
		 *
		 * @private
		 * @method _groupCollide
		 * @param {String} type one of 'overlap', 'collide', 'displace', 'bounce'
		 * @param {Sprite|Group} target Group or Sprite
		 * @param {Function} [callback] on collision.
		 * @return {Boolean} True if any collision/overlap occurred
		 */
		_groupCollide(type, target, callback) {
			var didCollide = false;
			for (var i = 0; i < this.size(); i++) {
				didCollide = this.get(i).AABBops(type, target, callback) || didCollide;
			}
			return didCollide;
		}
	}

	/**
	 * World
	 */
	class World extends pl.World {
		constructor(x, y, gravityVector, tileSize) {
			super(gravityVector, true);
			this.p = pInst;

			//box2d degrades as distance from 0,0 increases
			//"If your world units become larger than -1 to 1 kilometer,
			//then the lost precision can affect stability."
			//or a pixel limit of scale*1000 with origin at 0
			//default is to leave out-of-view space so that objects
			//can leave the scene and reappear without deletion
			this.width = width * 2;
			this.height = height * 2;
			//x is left boundary, y is center
			this.x = -width * 0.5 + (x || 0);
			this.y = -height * 0.5 + (y || 0);
			this.origin = new pl.Vec2(width / 2, height / 2);
			world = this;
		}
	}

	this.Sprite = Sprite;
	this.SpriteAnimation = SpriteAnimation;
	this.SpriteSheet = SpriteSheet;
	this.Group = Group;
	this.World = World;

	this.allSprites = new Group();
	this.allSprites._isAllSpritesGroup = true;
	this.allSprites.shouldCull = true;

	this.spriteUpdate = true;
});
