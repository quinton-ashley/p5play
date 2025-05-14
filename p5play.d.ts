import 'q5';

declare global {

class P5Play {
	/**
	 * Contains all the sprites in the sketch,
	 * but users should use the `allSprites` group.
	 *
	 * The keys are the sprite's unique ids.
	 * @type {Object.<number, Sprite>}
	 */
	sprites: {
		[x: number]: Sprite;
	};
	/**
	 * Contains all the groups in the sketch,
	 *
	 * The keys are the group's unique ids.
	 * @type {Object.<number, Group>}
	 */
	groups: {
		[x: number]: Group;
	};
	groupsCreated: number;
	spritesCreated: number;
	spritesDrawn: number;
	/**
	 * Cache for loaded images.
	 */
	images: {};
	/**
	 * Used for debugging, set to true to make p5play
	 * not load any images.
	 * @type {Boolean}
	 * @default false
	 */
	disableImages: boolean;
	/**
	 * The default color palette, at index 0 of this array,
	 * has all the letters of the English alphabet mapped to colors.
	 * @type {Array}
	 */
	palettes: any[];
	/**
	 * Emoji scale factor, used when making emoji images.
	 * @type {Number}
	 * @default 1
	 */
	emojiScale: number;
	/**
	 * Friendly rounding eliminates some floating point errors.
	 * @type {Boolean}
	 * @default true
	 */
	friendlyRounding: boolean;
	/**
	 * Groups that are removed using `group.remove()` are not
	 * fully deleted from `p5play.groups` by default, so their data
	 * is still accessible. Set to false to permanently delete
	 * removed groups, which reduces memory usage.
	 * @type {Boolean}
	 * @default true
	 */
	storeRemovedGroupRefs: boolean;
	/**
	 * Snaps sprites to the nearest `p5play.gridSize`
	 * increment when they are moved.
	 * @type {Boolean}
	 * @default false
	 */
	snapToGrid: boolean;
	/**
	 * The size of the grid cells that sprites are snapped to.
	 * @type {Number}
	 * @default 0.5
	 */
	gridSize: number;
	/**
	 * Information about the operating system being used to run
	 * p5play, retrieved from the `navigator` object.
	 */
	os: {};
	context: string;
	hasMouse: boolean;
	standardizeKeyboard: boolean;
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
	renderStats: boolean;
	/**
	 * This function is called when an image is loaded. By default it
	 * does nothing, but it can be overridden.
	 */
	onImageLoad(): void;
}
var p5play: P5Play;
var DYN: string;
var DYNAMIC: string;
var STA: string;
var STATIC: string;
var KIN: string;
var KINEMATIC: string;
/**
 * @class
 */
class Sprite {
	/**
	 * <a href="https://p5play.org/learn/sprite.html">
	 * Look at the Sprite reference pages before reading these docs.
	 * </a>
	 *
	 * Creates a new sprite.
	 *
	 * All parameters are optional. A sprite's default position is in the
	 * center of the canvas and default box collider is 50x50 pixels.
	 *
	 * Depending on the input parameters, the sprite can be created with
	 * a box, circle, polygon, or chain collider.
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
	 * @param {String} [physicsType] - physics type is DYNAMIC by default, can be
	 * STATIC, KINEMATIC, or NONE
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
	constructor(x?: number, y?: number, w?: number, h?: number, physicsType?: string, ...args: any[]);
	/**
	 * Each sprite has a unique id number. Don't change it!
	 * They are useful for debugging.
	 * @type {Number}
	 */
	idNum: number;
	/**
	 * Groups the sprite belongs to, including allSprites
	 * @type {Group[]}
	 * @default [allSprites]
	 */
	groups: Group[];
	/**
	 * Keys are the animation label, values are Ani objects.
	 * @type {Anis}
	 */
	animations: Anis;
	/**
	 * Joints that the sprite is attached to
	 * @type {Joint[]}
	 * @default []
	 */
	joints: Joint[];
	/**
	 * If set to true, p5play will record all changes to the sprite's
	 * properties in its `mod` array. Intended to be used to enable
	 * online multiplayer.
	 * @type {Boolean}
	 * @default undefined
	 */
	watch: boolean;
	/**
	 * An Object that has sprite property number codes as keys,
	 * these correspond to the index of the property in the
	 * Sprite.props array. The booleans values this object stores,
	 * indicate which properties were changed since the last frame.
	 * Useful for limiting the amount of sprite data sent in binary
	 * netcode to only the sprite properties that have been modified.
	 * @type {Object}
	 */
	mod: any;
	set tileSize(val: number);
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
	get tileSize(): number;
	set collider(val: string);
	/**
	 * Deprecated alias for `physicsType`/`physics`.
	 * @deprecated
	 * @type {String}
	 * @default DYNAMIC
	 */
	get collider(): string;
	set x(val: number);
	/**
	 * The horizontal position of the sprite.
	 * @type {Number}
	 */
	get x(): number;
	set y(val: number);
	/**
	 * The vertical position of the sprite.
	 * @type {Number}
	 */
	get y(): number;
	set image(img: new (width?: number, height?: number) => HTMLImageElement);
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
	get image(): new (width?: number, height?: number) => HTMLImageElement;
	/**
	 * Used to detect mouse events with the sprite.
	 * @type {_SpriteMouse}
	 */
	mouse: _SpriteMouse;
	set shape(val: string);
	/**
	 * The kind of shape: 'box', 'circle', 'chain', or 'polygon'.
	 *
	 * If a sprite with a circle shape has its shape type changed to
	 * chain or polygon, the circle will be turned into a dodecagon.
	 * @type {String}
	 * @default box
	 */
	get shape(): string;
	set w(val: number);
	/**
	 * The width of the sprite.
	 * @type {Number}
	 */
	get w(): number;
	set h(val: number);
	/**
	 * The height of the sprite.
	 * @type {Number}
	 */
	get h(): number;
	/**
	 * The sprite's position on the previous frame.
	 * @type {object}
	 */
	prevPos: object;
	prevRotation: number;
	/**
	 * Text displayed at the center of the sprite.
	 * @type {String}
	 * @default undefined
	 */
	text: string;
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
	addCollider(offsetX: number, offsetY: number, w: number, h: number, ...args: any[]): void;
	body: any;
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
	addSensor(offsetX: number, offsetY: number, w: number, h: number, ...args: any[]): void;
	set mass(val: number);
	/**
	 * The mass of the sprite's physics body.
	 * @type {Number}
	 */
	get mass(): number;
	set rotation(val: number);
	/**
	 * The angle of the sprite's rotation, not the direction it's moving.
	 *
	 * If angleMode is set to "degrees", the value will be returned in
	 * a range of -180 to 180.
	 * @type {Number}
	 * @default 0
	 */
	get rotation(): number;
	set vel(val: Vector);
	/**
	 * The sprite's velocity vector {x, y}
	 * @type {Vector}
	 * @default {x: 0, y: 0}
	 */
	get vel(): Vector;
	/**
	 * Removes the physics body colliders from the sprite but not
	 * overlap sensors.
	 */
	removeColliders(): void;
	/**
	 * Removes overlap sensors from the sprite.
	 */
	removeSensors(): void;
	set animation(val: Ani);
	/**
	 * Reference to the sprite's current animation.
	 * @type {Ani}
	 */
	get animation(): Ani;
	set ani(val: Ani);
	/**
	 * Reference to the sprite's current animation.
	 * @type {Ani}
	 */
	get ani(): Ani;
	/**
	 * Keys are the animation label, values are Ani objects
	 * @type {Anis}
	 */
	get anis(): Anis;
	set autoUpdate(val: boolean);
	/**
	 * Controls whether a sprite is updated before each physics update,
	 * when users let p5play automatically manage the frame cycle.
	 * @type {Boolean}
	 * @default true
	 */
	get autoUpdate(): boolean;
	set autoDraw(val: boolean);
	/**
	 * Controls whether a sprite is drawn after each physics update,
	 * when users let p5play automatically manage the frame cycle.
	 * @type {Boolean}
	 * @default true
	 */
	get autoDraw(): boolean;
	set allowSleeping(val: boolean);
	/**
	 * Controls the ability for a sprite to "sleep".
	 *
	 * "Sleeping" sprites are not included in the physics simulation, a
	 * sprite starts "sleeping" when it stops moving and doesn't collide
	 * with anything that it wasn't already touching.
	 * @type {Boolean}
	 * @default true
	 */
	get allowSleeping(): boolean;
	set bounciness(val: number);
	/**
	 * The bounciness of the sprite's physics body.
	 * @type {Number}
	 * @default 0.2
	 */
	get bounciness(): number;
	set rotationSpeed(val: number);
	/**
	 * The speed of the sprite's rotation in angles per frame.
	 * @type {Number}
	 * @default 0
	 */
	get rotationSpeed(): number;
	set physicsType(val: string);
	/**
	 * Verbose alias for `physics`.
	 * @type {String}
	 * @default DYNAMIC
	 */
	get physicsType(): string;
	set physics(val: string);
	/**
	 * The sprite's physics type. Default is DYNAMIC.
	 *
	 * The physics type can be one of the following:
	 * DYNAMIC, STATIC, KINEMATIC, or NONE.
	 *
	 * DYN, STA, and KIN can be used as shorthand.
	 *
	 * When a sprite's physics type is changed to NONE,
	 * or from NONE to another type, the sprite will
	 * maintain its current position, velocity, rotation, and
	 * rotation speed.
	 *
	 * Sprites can't have their physics type
	 * set to NONE if they have a polygon or chain collider,
	 * multiple colliders, or multiple sensors.
	 *
	 * To achieve the same effect as setting physics type
	 * to NONE, use `.overlaps(allSprites)` to have your
	 * sprite overlap with all sprites.
	 *
	 * @type {String}
	 * @default DYNAMIC
	 */
	get physics(): string;
	set color(val: Color);
	/**
	 * The sprite's current color. By default sprites get a random color.
	 * @type {Color}
	 * @default random color
	 */
	get color(): Color;
	set colour(val: Color);
	/**
	 * Alias for color. colour is the British English spelling.
	 * @type {Color}
	 * @default random color
	 */
	get colour(): Color;
	set fill(val: Color);
	/**
	 * Alias for sprite.fillColor
	 * @type {Color}
	 * @default random color
	 */
	get fill(): Color;
	set stroke(val: Color);
	/**
	 * Overrides sprite's stroke color. By default the stroke of a sprite
	 * is determined by its collider type, which can also be overridden
	 * by the sketch's stroke color.
	 * @type {Color}
	 * @default undefined
	 */
	get stroke(): Color;
	set strokeWeight(val: number);
	/**
	 * The sprite's stroke weight, the thickness of its outline.
	 * @type {Number}
	 * @default undefined
	 */
	get strokeWeight(): number;
	set textColor(val: Color);
	/**
	 * The sprite's text fill color. Black by default.
	 * @type {Color}
	 * @default black (#000000)
	 */
	get textColor(): Color;
	set textColour(val: any);
	get textColour(): any;
	set textFill(val: Color);
	/**
	 * The sprite's text fill color. Black by default.
	 * @type {Color}
	 * @default black (#000000)
	 */
	get textFill(): Color;
	set textSize(val: number);
	/**
	 * The sprite's text size, the sketch's current textSize by default.
	 * @type {Number}
	 */
	get textSize(): number;
	set textStroke(val: Color);
	/**
	 * The sprite's text stroke color.
	 * No stroke by default, does not inherit from the sketch's stroke color.
	 * @type {Color}
	 * @default undefined
	 */
	get textStroke(): Color;
	set textStrokeWeight(val: number);
	/**
	 * The sprite's text stroke weight, the thickness of its outline.
	 * No stroke by default, does not inherit from the sketch's stroke weight.
	 * @type {Number}
	 * @default undefined
	 */
	get textStrokeWeight(): number;
	set tile(val: string);
	/**
	 * The tile string represents the sprite in a tile map.
	 * @type {String}
	 */
	get tile(): string;
	set bearing(val: number);
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
	get bearing(): number;
	set debug(val: boolean);
	/**
	 * If true, an outline of the sprite's collider will be drawn.
	 * @type {Boolean}
	 * @default false
	 */
	get debug(): boolean;
	set density(val: number);
	/**
	 * The density of the sprite's physics body.
	 * @type {Number}
	 * @default 5
	 */
	get density(): number;
	set direction(val: number);
	/**
	 * The angle of the sprite's movement.
	 * @type {Number}
	 * @default 0 ("right")
	 */
	get direction(): number;
	set drag(val: number);
	/**
	 * The amount of resistance a sprite has to being moved.
	 * @type {Number}
	 * @default 0
	 */
	get drag(): number;
	set draw(val: Function);
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
	get draw(): Function;
	set dynamic(val: boolean);
	/**
	 * True if the sprite's physics body is dynamic.
	 * @type {Boolean}
	 * @default true
	 */
	get dynamic(): boolean;
	/**
	 * Returns the first node in a linked list of the planck physics
	 * body's fixtures.
	 */
	get fixture(): any;
	/**
	 * Returns the first node in a linked list of the planck physics
	 * body's fixtures.
	 */
	get fixtureList(): any;
	set friction(val: number);
	/**
	 * The amount the sprite's physics body resists moving
	 * when rubbing against another physics body.
	 * @type {Number}
	 * @default 0.5
	 */
	get friction(): number;
	set heading(val: string);
	/**
	 * The sprite's heading. This is a string that can be set to
	 * "up", "down", "left", "right", "upRight", "upLeft", "downRight"
	 *
	 * It ignores cardinal direction word order, capitalization, spaces,
	 * underscores, and dashes.
	 * @type {String}
	 * @default undefined
	 */
	get heading(): string;
	set img(val: new (width?: number, height?: number) => HTMLImageElement);
	/**
	 * Alias for `sprite.image`.
	 * @type {Image}
	 */
	get img(): new (width?: number, height?: number) => HTMLImageElement;
	/**
	 * Read only. True if the sprite is moving.
	 * @type {Boolean}
	 */
	get isMoving(): boolean;
	set isSuperFast(val: boolean);
	/**
	 * Set this to true if the sprite goes really fast to prevent
	 * inaccurate physics simulation.
	 * @type {Boolean}
	 * @default false
	 */
	get isSuperFast(): boolean;
	set kinematic(val: boolean);
	/**
	 * True if the sprite's physics body is kinematic.
	 * @type {Boolean}
	 * @default false
	 */
	get kinematic(): boolean;
	set layer(val: number);
	/**
	 * By default sprites are drawn in the order they were created in.
	 * You can change the draw order by editing sprite's layer
	 * property. Sprites with the highest layer value get drawn first.
	 * @type {Number}
	 */
	get layer(): number;
	set life(val: number);
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
	get life(): number;
	/**
	 * Recalculates the sprite's mass based on its current
	 * density and size.
	 *
	 * Does not change the sprite's center of mass, to do so
	 * use the `resetCenterOfMass` function.
	 */
	resetMass(): void;
	/**
	 * Recalculates the sprite's center of mass based on the masses of
	 * its fixtures and their positions. Moves the sprite's center to
	 * the new center of mass, but doesn't actually change the positions
	 * of its fixtures relative to the world.
	 *
	 * In p5play a sprite's center (position) is always the same as its
	 * center of mass and center of rotation.
	 */
	resetCenterOfMass(): void;
	set mirror(val: any);
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
	get mirror(): any;
	set offset(val: object);
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
	get offset(): object;
	set opacity(val: number);
	/**
	 * The sprite's opacity. 0 is transparent, 1 is opaque.
	 * @type {Number}
	 * @default 1
	 */
	get opacity(): number;
	set previousPosition(val: any);
	/**
	 * Alias for sprite.prevPos
	 * @type {Object}
	 */
	get previousPosition(): any;
	set previousRotation(val: number);
	/**
	 * Alias for sprite.prevRotation
	 * @type {Number}
	 */
	get previousRotation(): number;
	set pixelPerfect(val: boolean);
	/**
	 * By default p5play draws sprites with subpixel rendering.
	 *
	 * Set pixelPerfect to true to make p5play always display sprites
	 * at integer pixel precision. This is useful for making retro games.
	 * @type {Boolean}
	 * @default false
	 */
	get pixelPerfect(): boolean;
	set removed(val: boolean);
	/**
	 * If the sprite has been removed from the world.
	 * @type {Boolean}
	 * @default false
	 */
	get removed(): boolean;
	set rotationDrag(val: number);
	/**
	 * The amount the sprite resists rotating.
	 * @type {Number}
	 * @default 0
	 */
	get rotationDrag(): number;
	set rotationLock(val: boolean);
	/**
	 * If true, the sprite can not rotate.
	 * @type {Boolean}
	 * @default false
	 */
	get rotationLock(): boolean;
	set scale(val: number | any);
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
	get scale(): number | any;
	set sleeping(val: boolean);
	/**
	 * Wake a sprite up or put it to sleep.
	 *
	 * "Sleeping" sprites are not included in the physics simulation, a
	 * sprite starts "sleeping" when it stops moving and doesn't collide
	 * with anything that it wasn't already touching.
	 * @type {Boolean}
	 * @default true
	 */
	get sleeping(): boolean;
	set speed(val: number);
	/**
	 * The sprite's speed.
	 *
	 * Setting speed to a negative value will make the sprite move
	 * 180 degrees opposite of its current direction angle.
	 * @type {Number}
	 * @default 0
	 */
	get speed(): number;
	set static(val: boolean);
	/**
	 * Is the sprite's physics collider static?
	 * @type {Boolean}
	 * @default false
	 */
	get static(): boolean;
	set tint(val: Color);
	/**
	 * Tint color applied to the sprite when drawn.
	 *
	 * Note that this is not good for performance, you should probably
	 * pre-render the effect if you want to use it a lot.
	 * @type {Color}
	 * @default undefined
	 */
	get tint(): Color;
	set tintColor(val: Color);
	/**
	 * Alias for sprite.tint
	 * @type {Color}
	 * @default undefined
	 */
	get tintColor(): Color;
	/**
	 * The sprite's vertices, in vertex mode format.
	 * @type {Array}
	 */
	set vertices(val: any[]);
	get vertices(): any[];
	set visible(val: boolean);
	/**
	 * If true the sprite is shown, if set to false the sprite is hidden.
	 *
	 * Becomes null when the sprite is off screen but will be drawn and
	 * set to true again if it goes back on screen.
	 * @type {Boolean}
	 * @default true
	 */
	get visible(): boolean;
	set pos(val: Vector);
	/**
	 * The position vector {x, y}
	 * @type {Vector}
	 */
	get pos(): Vector;
	set position(val: Vector);
	/**
	 * The position vector {x, y}
	 * @type {Vector}
	 */
	get position(): Vector;
	/**
	 * The sprite's absolute position on the canvas. Read only.
	 */
	get canvasPos(): any;
	set hw(val: number);
	/**
	 * Half the width of the sprite.
	 * @type {Number}
	 */
	get hw(): number;
	set width(val: number);
	/**
	 * The width of the sprite.
	 * @type {Number}
	 */
	get width(): number;
	set halfWidth(val: number);
	/**
	 * Half the width of the sprite.
	 * @type {Number}
	 */
	get halfWidth(): number;
	set hh(val: number);
	/**
	 * Half the height of the sprite.
	 * @type {Number}
	 */
	get hh(): number;
	set height(val: number);
	/**
	 * The height of the sprite.
	 * @type {Number}
	 */
	get height(): number;
	set halfHeight(val: number);
	/**
	 * Half the height of the sprite.
	 * @type {Number}
	 */
	get halfHeight(): number;
	set d(val: number);
	/**
	 * The diameter of a circular sprite.
	 * @type {Number}
	 */
	get d(): number;
	set diameter(val: number);
	/**
	 * The diameter of a circular sprite.
	 * @type {Number}
	 */
	get diameter(): number;
	set r(val: number);
	/**
	 * The radius of a circular sprite.
	 * @type {Number}
	 */
	get r(): number;
	set radius(val: number);
	/**
	 * The radius of a circular sprite.
	 * @type {Number}
	 */
	get radius(): number;
	set update(val: Function);
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
	get update(): Function;
	set postDraw(val: Function);
	/**
	 * Runs at the end of the p5play frame cycle.
	 *
	 * Users should not directly run this function.
	 * @type {Function}
	 */
	get postDraw(): Function;
	set velocity(val: Vector);
	/**
	 * The sprite's velocity vector {x, y}
	 * @type {Vector}
	 * @default {x: 0, y: 0}
	 */
	get velocity(): Vector;
	set gravityScale(val: number);
	/**
	 * A ratio that defines how much the sprite is affected by gravity.
	 * @type {Number}
	 * @default 1
	 */
	get gravityScale(): number;
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
	applyForce(amount: number, origin?: Vector, ...args: any[]): void;
	/**
	 * Applies a force that's scaled to the sprite's mass.
	 *
	 * @param {Number} amount
	 * @param {Vector} [origin]
	 */
	applyForceScaled(amount: number, origin?: Vector, ...args: any[]): void;
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
	attractTo(x: number, y: number, force: number, radius?: number, easing?: number): void;
	repelFrom(x: any, y: any, force: any, radius: any, easing: any): void;
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
	applyTorque(val: any): void;
	/**
	 * Moves a sprite towards a position at a percentage of the distance
	 * between itself and the destination.
	 *
	 * @param {Number|Object} x - destination x or an object with x and y properties
	 * @param {Number} y - destination y
	 * @param {Number} [tracking] - percent of the distance to move towards the destination as a 0-1 value, default is 0.1 (10% tracking)
	 */
	moveTowards(x: number | any, y: number, tracking?: number): void;
	/**
	 * Moves the sprite away from a position, the opposite of moveTowards,
	 * at a percentage of the distance between itself and the position.
	 * @param {Number|Object} x - destination x or an object with x and y properties
	 * @param {Number} y - destination y
	 * @param {Number} [repel] - percent of the distance to the repel position as a 0-1 value, default is 0.1 (10% repel)
	 */
	moveAway(x: number | any, y: number, repel?: number, ...args: any[]): void;
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
	move(distance: number, direction?: number | string, speed?: number, ...args: any[]): Promise<any>;
	/**
	 * Move the sprite to a position.
	 *
	 * @param {Number|Object} x - destination x or an object with x and y properties
	 * @param {Number} y - destination y
	 * @param {Number} [speed] - if not given, the sprite's current speed is used, unless it is 0 then it is given a default speed of 1 or 0.1 if the sprite's tileSize is greater than 1
	 * @returns {Promise} resolves to true when the movement is complete
	 * or to false if the sprite will not reach its destination
	 */
	moveTo(x: number | any, y: number, speed?: number): Promise<any>;
	/**
	 * Rotates the sprite towards an angle or position
	 * with x and y properties.
	 *
	 * @param {Number|Object} angle - angle in degrees or an object with x and y properties
	 * @param {Number} [tracking] - percent of the distance to rotate on each frame towards the target angle, default is 0.1 (10%)
	 * @param {Number} [facing] - (only specify if position is given) rotation angle the sprite should be at when "facing" the position, default is 0
	 */
	rotateTowards(angle: number | any, tracking?: number, ...args: any[]): void;
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
	angleTo(x: number, y: number): number;
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
	rotationToFace(x: number, y: number, facing?: number): number;
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
	angleToFace(x: number, y: number, facing: number): number;
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
	rotateTo(angle: number | any, speed?: number, facing?: number, ...args: any[]): Promise<any>;
	/**
	 * Rotates the sprite by the smallest angular distance
	 * to an angle or to face a position at a given absolute
	 * rotation speed.
	 *
	 * @param {Number|Object} angle - angle or a position object with x and y properties
	 * @param {Number} speed - absolute amount of rotation per frame, if not given the sprite's current `rotationSpeed` is used
	 * @param {Number} facing - relative angle the sprite should be at when "facing" the given position, default is 0
	 */
	rotateMinTo(angle: number | any, speed: number, facing: number, ...args: any[]): Promise<any>;
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
	rotate(angle: number, speed?: number): Promise<any>;
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
	addAni(...args: any[]): any;
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
	addAnis(...args: any[]): void;
	spriteSheet: any;
	/**
	 * Changes the sprite's animation. Use `addAni` to define the
	 * animation(s) first.
	 *
	 * @param {...String} anis - the names of one or many animations to be played in
	 * sequence
	 * @returns A promise that fulfills when the animation or sequence of animations
	 * completes
	 */
	changeAni(...args: string[]): Promise<void>;
	/**
	 * Changes the sprite's animation. Use `addAni` to define the
	 * animation(s) first. Alt for `changeAni`.
	 *
	 * @param {...String} anis - the names of one or many animations to be played in
	 * sequence
	 * @returns A promise that fulfills when the animation or sequence of animations
	 * completes
	 */
	changeAnimation(...args: string[]): Promise<void>;
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
	remove(): void;
	/**
	 * Warning: This function might be changed in a future release.
	 *
	 * Returns the sprite's unique identifier `sprite.idNum`.
	 *
	 * @returns the sprite's id
	 */
	toString(): string;
	collide(target: any, callback: any): boolean;
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
	collides(target: Sprite | Group, callback?: Function): boolean;
	/**
	 * Returns a truthy value while the sprite is colliding with the
	 * target sprite or group. The value is the number of frames that
	 * the sprite has been colliding with the target.
	 *
	 * @param {Sprite|Group} target
	 * @param {Function} [callback]
	 * @return {Number} frames
	 */
	colliding(target: Sprite | Group, callback?: Function): number;
	/**
	 * Returns true on the first frame that the sprite no longer overlaps
	 * with the target sprite or group.
	 *
	 * @param {Sprite|Group} target
	 * @param {Function} [callback]
	 * @return {Boolean}
	 */
	collided(target: Sprite | Group, callback?: Function): boolean;
	overlap(target: any, callback: any): boolean;
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
	overlaps(target: Sprite | Group, callback?: Function): boolean;
	/**
	 * Returns a truthy value while the sprite is overlapping with the
	 * target sprite or group. The value returned is the number of
	 * frames the sprite has been overlapping with the target.
	 *
	 * @param {Sprite|Group} target
	 * @param {Function} [callback]
	 * @return {Number} frames
	 */
	overlapping(target: Sprite | Group, callback?: Function): number;
	/**
	 * Returns true on the first frame that the sprite no longer overlaps
	 * with the target sprite or group.
	 *
	 * @param {Sprite|Group} target
	 * @param {Function} [callback]
	 * @return {Boolean}
	 */
	overlapped(target: Sprite | Group, callback?: Function): boolean;
	/**
	 * This function is used internally if a sprite overlap detection
	 * function is called but the sprite has no overlap sensors.
	 *
	 * It creates sensor fixtures that are the same size as the sprite's
	 * colliders. If you'd like to add more sensors to a sprite, use the
	 * addSensor function.
	 */
	addDefaultSensors(): void;
	/**
	 * Returns the distance to another sprite, the mouse, a touch,
	 * or any other object with x and y properties. Uses p5's `dist`
	 * function.
	 * @param {Sprite} o object with x and y properties
	 * @returns {Number} distance
	 */
	distanceTo(o: Sprite): number;
}
/**
 * @class
 * @extends Array<Image>
 */
class Ani extends Array<new (width?: number, height?: number) => HTMLImageElement> {
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
	constructor(...args: (new (width?: number, height?: number) => HTMLImageElement)[]);
	/**
	 * The name of the animation
	 * @type {String}
	 */
	name: string;
	targetFrame: number;
	/**
	 * The offset is how far the animation should be placed from
	 * the location it is played at.
	 * @type {Object}
	 * @example
	 * ani.offset.x = 16;
	 */
	offset: any;
	demoMode: any;
	/**
	 * True if the animation is currently playing.
	 * @type {Boolean}
	 * @default true
	 */
	playing: boolean;
	/**
	 * Animation visibility.
	 * @type {Boolean}
	 * @default true
	 */
	visible: boolean;
	/**
	 * If set to false the animation will stop after reaching the last frame
	 * @type {Boolean}
	 * @default true
	 */
	looping: boolean;
	/**
	 * Ends the loop on frame 0 instead of the last frame.
	 * This is useful for animations that are symmetric.
	 * For example a walking cycle where the first frame is the
	 * same as the last frame.
	 * @type {Boolean}
	 * @default false
	 */
	endOnFirstFrame: boolean;
	/**
	 * True if frame changed during the last draw cycle
	 * @type {Boolean}
	 */
	frameChanged: boolean;
	onComplete: any;
	onChange: any;
	rotation: any;
	spriteSheet: any;
	set frame(val: number);
	/**
	 * The index of the current frame that the animation is on.
	 * @type {Number}
	 */
	get frame(): number;
	set frameDelay(val: number);
	/**
	 * Delay between frames in number of draw cycles.
	 * If set to 4 the framerate of the animation would be the
	 * sketch framerate divided by 4 (60fps = 15fps)
	 * @type {Number}
	 * @default 4
	 */
	get frameDelay(): number;
	set scale(val: number | any);
	/**
	 * The animation's scale.
	 *
	 * Can be set to a number to scale both x and y
	 * or an object with x and/or y properties.
	 * @type {Number|Object}
	 * @default 1
	 */
	get scale(): number | any;
	/**
	 * Make a copy of the animation.
	 *
	 * @return {Ani} A copy of the animation.
	 */
	clone(): Ani;
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
	draw(x: number, y: number, r?: number, sx?: number, sy?: number): void;
	x: number;
	y: number;
	update(): void;
	/**
	 * Plays the animation, starting from the specified frame.
	 *
	 * @returns [Promise] a promise that resolves when the animation completes
	 */
	play(frame: any): Promise<any>;
	/**
	 * Pauses the animation.
	 */
	pause(frame: any): void;
	/**
	 * Stops the animation. Alt for pause.
	 */
	stop(frame: any): void;
	/**
	 * Plays the animation backwards.
	 * Equivalent to ani.goToFrame(0)
	 *
	 * @returns [Promise] a promise that resolves when the animation completes
	 * rewinding
	 */
	rewind(): Promise<any>;
	/**
	 * Plays the animation forwards and loops it.
	 */
	loop(): void;
	/**
	 * Prevents the animation from looping
	 */
	noLoop(): void;
	/**
	 * Goes to the next frame and stops.
	 */
	nextFrame(): void;
	/**
	 * Goes to the previous frame and stops.
	 */
	previousFrame(): void;
	/**
	 * Plays the animation forward or backward toward a target frame.
	 *
	 * @param {Number} toFrame - Frame number destination (starts from 0)
	 * @returns [Promise] a promise that resolves when the animation completes
	 */
	goToFrame(toFrame: number): Promise<any>;
	/**
	 * The index of the last frame. Read only.
	 * @type {Number}
	 */
	get lastFrame(): number;
	/**
	 * The current frame as an Image object. Read only.
	 * @type {Image}
	 */
	get frameImage(): new (width?: number, height?: number) => HTMLImageElement;
	/**
	 * Width of the animation's current frame.
	 * @type {Number}
	 */
	get w(): number;
	/**
	 * Width of the animation's current frame.
	 * @type {Number}
	 */
	get width(): number;
	get defaultWidth(): any;
	/**
	 * Height of the animation's current frame.
	 * @type {Number}
	 */
	get h(): number;
	/**
	 * Height of the animation's current frame.
	 * @type {Number}
	 */
	get height(): number;
	get defaultHeight(): any;
}
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
class Anis {
	set width(val: any);
	get width(): any;
	w: any;
	set height(val: any);
	get height(): any;
	h: any;
	#private;
}
/**
 * @class
 * @extends Array<Sprite>
 */
class Group extends Array<Sprite> {
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
	constructor(...args: any[]);
	/**
	 * @type {Number}
	 */
	x: number;
	/**
	 * @type {Number}
	 */
	y: number;
	/**
	 * @type {Number}
	 */
	vel: number;
	/**
	 * @type {Number}
	 */
	rotation: number;
	/**
	 * @type {Number}
	 */
	rotationSpeed: number;
	/**
	 * @type {Boolean}
	 */
	autoDraw: boolean;
	/**
	 * @type {Boolean}
	 */
	allowSleeping: boolean;
	/**
	 * @type {Number}
	 */
	autoUpdate: number;
	/**
	 * @type {Number}
	 */
	bounciness: number;
	/**
	 * @type {Number}
	 */
	collider: number;
	/**
	 * @type {Number}
	 */
	color: number;
	/**
	 * @type {Boolean}
	 */
	debug: boolean;
	/**
	 * @type {Number}
	 */
	density: number;
	/**
	 * @type {Number}
	 */
	direction: number;
	/**
	 * @type {Number}
	 */
	drag: number;
	/**
	 * @type {Number}
	 */
	friction: number;
	/**
	 * @type {Number}
	 */
	h: number;
	/**
	 * @type {Boolean}
	 */
	isSuperFast: boolean;
	/**
	 * @type {Number}
	 */
	layer: number;
	/**
	 * @type {Number}
	 */
	life: number;
	/**
	 * @type {Number}
	 */
	mass: number;
	/**
	 * @type {Object}
	 */
	mirror: any;
	/**
	 * @type {Vector}
	 */
	offset: Vector;
	/**
	 * @type {Boolean}
	 */
	pixelPerfect: boolean;
	/**
	 * @type {Boolean}
	 */
	removed: boolean;
	/**
	 * @type {Number}
	 */
	rotationDrag: number;
	/**
	 * @type {Boolean}
	 */
	rotationLock: boolean;
	/**
	 * @type {Vector}
	 */
	scale: Vector;
	/**
	 * @type {Number}
	 */
	shape: number;
	/**
	 * @type {Boolean}
	 */
	sleeping: boolean;
	/**
	 * @type {Color}
	 */
	stroke: Color;
	/**
	 * @type {Number}
	 */
	strokeWeight: number;
	/**
	 * @type {Number}
	 */
	text: number;
	/**
	 * @type {Color}
	 */
	textColor: Color;
	/**
	 * @type {String}
	 */
	tile: string;
	/**
	 * @type {Number}
	 */
	tileSize: number;
	/**
	 * @type {Boolean}
	 */
	visible: boolean;
	/**
	 * @type {Number}
	 */
	w: number;
	/**
	 * @type {Number}
	 */
	bearing: number;
	/**
	 * @type {Number}
	 */
	d: number;
	/**
	 * @type {Boolean}
	 */
	dynamic: boolean;
	/**
	 * @type {String}
	 */
	heading: string;
	/**
	 * @type {Boolean}
	 */
	kinematic: boolean;
	/**
	 * @type {Boolean}
	 */
	resetAnimationsOnChange: boolean;
	/**
	 * @type {Number}
	 */
	speed: number;
	/**
	 * @type {Boolean}
	 */
	static: boolean;
	/**
	 * Each group has a unique id number. Don't change it!
	 * Its useful for debugging.
	 * @type {Number}
	 */
	idNum: number;
	/**
	 * Groups can have subgroups, which inherit the properties
	 * of their parent groups.
	 * @type {Group[]}
	 * @default []
	 */
	subgroups: {
		[x: string]: any;
	}[];
	parent: any;
	/**
	 * Keys are the animation label, values are Ani objects.
	 * @type {Anis}
	 */
	animations: Anis;
	Sprite: typeof Sprite;
	GroupSprite: typeof Sprite;
	Group: typeof Group;
	Subgroup: typeof Group;
	mouse: {
		presses: any;
		pressing: any;
		pressed: any;
		holds: any;
		holding: any;
		held: any;
		released: any;
		hovers: any;
		hovering: any;
		hovered: any;
	};
	/**
	 * autoCull is a property of the allSprites group only,
	 * that controls whether sprites are automatically removed
	 * when they are 10,000 pixels away from the camera.
	 *
	 * It only needs to be set to false once and then it will
	 * remain false for the rest of the sketch, unless changed.
	 * @type {Boolean}
	 */
	autoCull: boolean;
	/**
	 * Alias for `push`.
	 *
	 * Adds a sprite to the end of the group.
	 */
	add: (...sprites: Sprite[]) => number;
	/**
	 * Alias for group.includes
	 *
	 * Check if a sprite is in the group.
	 */
	contains: (searchElement: Sprite, fromIndex?: number) => boolean;
	set ani(val: Ani);
	/**
	 * Reference to the group's current animation.
	 * @type {Ani}
	 */
	get ani(): Ani;
	set animation(val: Ani);
	/**
	 * Reference to the group's current animation.
	 * @type {Ani}
	 */
	get animation(): Ani;
	/**
	 * The group's animations.
	 * @type {Anis}
	 */
	get anis(): Anis;
	set img(val: new (width?: number, height?: number) => HTMLImageElement);
	/**
	 * Alias for `group.image`.
	 * @type {Image}
	 */
	get img(): new (width?: number, height?: number) => HTMLImageElement;
	set image(img: new (width?: number, height?: number) => HTMLImageElement);
	/**
	 * The group's image.
	 * @type {Image}
	 */
	get image(): new (width?: number, height?: number) => HTMLImageElement;
	set amount(val: number);
	/**
	 * Depending on the value that the amount property is set to, the group will
	 * either add or remove sprites.
	 * @type {Number}
	 */
	get amount(): number;
	set diameter(val: number);
	/**
	 * @type {Number}
	 */
	get diameter(): number;
	set width(val: number);
	/**
	 * @type {Number}
	 */
	get width(): number;
	set height(val: number);
	/**
	 * @type {Number}
	 */
	get height(): number;
	set velocity(val: Vector);
	/**
	 * The sprite's velocity vector {x, y}
	 * @type {Vector}
	 * @default {x: 0, y: 0}
	 */
	get velocity(): Vector;
	centroid: {
		x: number;
		y: number;
	};
	collide(target: any, callback: any): boolean;
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
	collides(target: Group, callback?: Function): boolean;
	/**
	 * Returns the amount of frames that the group has been colliding
	 * with the target group for, which is a truthy value. Returns 0 if
	 * the group is not colliding with the target group.
	 *
	 * @param {Group} target
	 * @param {Function} [callback]
	 * @return {Number} frames
	 */
	colliding(target: Group, callback?: Function): number;
	/**
	 * Returns true on the first frame that the group no longer overlaps
	 * with the target group.
	 *
	 * @param {Group} target
	 * @param {Function} [callback]
	 * @return {Boolean}
	 */
	collided(target: Group, callback?: Function): boolean;
	overlap(target: any, callback: any): boolean;
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
	overlaps(target: Group, callback?: Function): boolean;
	/**
	 * Returns the amount of frames that the group has been overlapping
	 * with the target group for, which is a truthy value. Returns 0 if
	 * the group is not overlapping with the target group.
	 *
	 * @param {Group} target
	 * @param {Function} [callback]
	 * @return {Number} frames
	 */
	overlapping(target: Group, callback?: Function): number;
	/**
	 * Returns true on the first frame that the group no longer overlaps
	 * with the target group.
	 *
	 * @param {Group} target
	 * @param {Function} [callback]
	 * @return {Boolean}
	 */
	overlapped(target: Group, callback?: Function): boolean;
	/**
	 */
	applyForce(...args: any[]): void;
	/**
	 */
	applyForceScaled(...args: any[]): void;
	/**
	 */
	attractTo(...args: any[]): void;
	/**
	 */
	applyTorque(...args: any[]): void;
	/**
	 */
	move(distance: any, direction: any, speed: any): Promise<any[]>;
	/**
	 */
	moveTo(x: any, y: any, speed: any): Promise<any[]>;
	/**
	 */
	moveTowards(x: any, y: any, tracking: any): void;
	/**
	 */
	moveAway(x: any, y: any, repel: any): void;
	/**
	 */
	repelFrom(...args: any[]): void;
	/**
	 * Alias for group.length
	 * @deprecated
	 */
	size(): number;
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
	cull(top: number, bottom: number, left: number, right: number, cb?: Function): number;
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
	remove(item: Sprite | number): Sprite;
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
	splice(idx: number, amount: number): Sprite[];
	/**
	 * Not supported!
	 * @return {Number} the new length of the group
	 */
	unshift(): number;
	/**
	 * Removes all the sprites in the group from the world and
	 * every other group they belong to.
	 *
	 * Does not delete the group itself.
	 */
	removeAll(): void;
	/**
	 * Updates all the sprites in the group.
	 */
	update(): void;
	/**
	 * Draws all the sprites in the group in ascending order
	 * by `sprite.layer`.
	 */
	draw(): void;
	/**
	 * Runs every group sprite's post draw function.
	 */
	postDraw(): void;
}
/**
 * @class
 * @extends planck.World
 */
class World {
	mod: {};
	/**
	 * Changes the world's origin point,
	 * where (0, 0) is on the canvas.
	 * @type {Object}
	 * @property {Number} x
	 * @property {Number} y
	 * @default { x: 0, y: 0 }
	 */
	origin: any;
	contacts: any[];
	/**
	 * @type {Number}
	 * @default 8
	 */
	velocityIterations: number;
	/**
	 * @type {Number}
	 * @default 3
	 */
	positionIterations: number;
	set velocityThreshold(val: number);
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
	get velocityThreshold(): number;
	/**
	 * The time elapsed in the physics simulation in seconds.
	 * @type {Number}
	 */
	physicsTime: number;
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
	meterSize: number;
	/**
	 * The sprite the mouse is hovering over.
	 *
	 * If the mouse is hovering over several sprites, the mouse
	 * sprite will be the one with the highest layer value.
	 * @type {Sprite}
	 * @default null
	 */
	mouseSprite: Sprite;
	/**
	 * The sprite(s) that the mouse is hovering over.
	 * @type {Sprite[]}
	 * @default []
	 */
	mouseSprites: Sprite[];
	/**
	 * @type {Boolean}
	 * @default true
	 */
	autoStep: boolean;
	step: (timeStep?: number, velocityIterations?: number, positionIterations?: number) => void;
	steppedEvent: Event;
	set gravity(val: any);
	/**
	 * Gravity force vector that affects all dynamic physics colliders.
	 * @type {Object}
	 * @property {Number} x
	 * @property {Number} y
	 * @default { x: 0, y: 0 }
	 */
	get gravity(): any;
	set timeScale(val: number);
	/**
	 * A time scale of 1.0 represents real time.
	 * Accepts decimal values between 0 and 2.
	 * @type {Number}
	 * @default 1.0
	 */
	get timeScale(): number;
	set updateRate(val: number);
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
	get updateRate(): number;
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
	physicsUpdate(timeStep?: number, velocityIterations?: number, positionIterations?: number): void;
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
	extrapolationUpdate(timeStep?: number): void;
	/**
	 * The real time in seconds since the world was created, including
	 * time spent paused.
	 * @type {Number}
	 */
	get realTime(): number;
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
	getSpritesAt(x: number, y: number, group?: Group, cameraActiveWhenDrawn?: boolean): Sprite[];
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
	getSpriteAt(x: number, y: number, group?: Group): Sprite;
	getMouseSprites(): Sprite[];
	set allowSleeping(val: boolean);
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
	get allowSleeping(): boolean;
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
	rayCast(startPos: any, direction: number, maxDistance: number): Sprite;
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
	rayCastAll(startPos: any, direction: number, maxDistance: number, limiter?: Function, ...args: any[]): Sprite[];
}
/**
 * @class
 */
class Camera {
	/**
	 * Read only. True if the camera is active.
	 * Use camera.on() to activate the camera.
	 * @type {Boolean}
	 * @default false
	 */
	isActive: boolean;
	bound: {
		min: {
			x: number;
			y: number;
		};
		max: {
			x: number;
			y: number;
		};
	};
	set pos(val: any);
	/**
	 * The camera's position. {x, y}
	 * @type {Object}
	 */
	get pos(): any;
	set x(val: number);
	/**
	 * The camera x position.
	 * @type {Number}
	 */
	get x(): number;
	set y(val: number);
	/**
	 * The camera y position.
	 * @type {Number}
	 */
	get y(): number;
	set position(val: any);
	/**
	 * The camera's position. Alias for pos.
	 * @type {Object}
	 */
	get position(): any;
	/**
	 * Moves the camera to a position. Similar to `sprite.moveTo`.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} speed
	 * @returns {Promise} resolves true when the camera reaches the target position
	 */
	moveTo(x: number, y: number, speed: number): Promise<any>;
	set zoom(val: number);
	/**
	 * Camera zoom.
	 *
	 * A scale of 1 will be the normal size. Setting it to 2
	 * will make everything appear twice as big. .5 will make
	 * everything look half size.
	 * @type {Number}
	 * @default 1
	 */
	get zoom(): number;
	/**
	 * Zoom the camera at a given speed.
	 *
	 * @param {Number} target - The target zoom
	 * @param {Number} speed - The amount of zoom per frame
	 * @returns {Promise} resolves true when the camera reaches the target zoom
	 */
	zoomTo(target: number, speed: number): Promise<any>;
	/**
	 * Activates the camera.
	 *
	 * The canvas will be drawn according to the camera position and scale until
	 * camera.off() is called.
	 */
	on(): void;
	/**
	 * Deactivates the camera.
	 *
	 * The canvas will be drawn normally, ignoring the camera's position
	 * and scale until camera.on() is called.
	 */
	off(): void;
}
/**
 * @class
 */
class Tiles {
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
	constructor(tiles: string, x: number, y: number, w: number, h: number);
}
function createTiles(tiles: any, x: any, y: any, w: any, h: any): any;
/**
 * @class
 */
class Joint {
	/**
	 * Using this Joint class directly is not recommended, but
	 * if it is used a GlueJoint will be created.
	 *
	 * It's better to use a specific joint class constructor:
	 *
	 * GlueJoint, DistanceJoint, WheelJoint, HingeJoint,
	 * SliderJoint, RopeJoint, or GrabberJoint.
	 *
	 * All other joint classes extend this class. Joint type
	 * can not be changed after a joint is created.
	 *
	 * @param {Sprite} spriteA
	 * @param {Sprite} spriteB
	 * @param {String} [type]
	 */
	constructor(spriteA: Sprite, spriteB: Sprite, type?: string);
	/**
	 * The first sprite in the joint.
	 * @type {Sprite}
	 */
	spriteA: Sprite;
	/**
	 * The second sprite in the joint.
	 * @type {Sprite}
	 */
	spriteB: Sprite;
	/**
	 * Read only. The type of joint. Can be one of:
	 *
	 * "glue", "distance", "wheel", "hinge", "slider", or "rope".
	 *
	 * Can't be changed after the joint is created.
	 * @type {String}
	 */
	type: string;
	/**
	 * Determines whether to draw the joint if spriteA
	 * or spriteB is drawn.
	 * @type {Boolean}
	 * @default true
	 */
	visible: boolean;
	set draw(val: Function);
	/**
	 * Function that draws the joint. Can be overridden by the user.
	 * @type {Function}
	 * @param {Number} xA
	 * @param {Number} yA
	 * @param {Number} [xB]
	 * @param {Number} [yB]
	 */
	get draw(): Function;
	set offsetA(val: Vector);
	/**
	 * Offset to the joint's anchorA position from the center of spriteA.
	 *
	 * Only distance and hinge joints have an offsetA.
	 * @type {Vector}
	 * @default {x: 0, y: 0}
	 */
	get offsetA(): Vector;
	set offsetB(val: Vector);
	/**
	 * Offset to the joint's anchorB position from the center of spriteB.
	 *
	 * Only distance, hinge, and wheel joints have an offsetB.
	 * @type {Vector}
	 * @default {x: 0, y: 0}
	 */
	get offsetB(): Vector;
	set springiness(val: number);
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
	get springiness(): number;
	set damping(val: number);
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
	get damping(): number;
	set speed(val: number);
	/**
	 * The current speed of the joint's motor.
	 * @type {Number}
	 * @default 0
	 */
	get speed(): number;
	get motorSpeed(): any;
	set enableMotor(val: boolean);
	/**
	 * Enable or disable the joint's motor.
	 * Disabling the motor is like putting a
	 * car in neutral.
	 * @type {Boolean}
	 */
	get enableMotor(): boolean;
	set maxPower(val: number);
	/**
	 * Max power is how the amount of torque a joint motor can exert
	 * around its axis of rotation.
	 * @type {Number}
	 * @default 0
	 */
	get maxPower(): number;
	/**
	 * Read only.  The joint's current power, the amount of torque
	 * being applied on the joint's axis of rotation.
	 * @type {Number}
	 * @default 0
	 */
	get power(): number;
	set collideConnected(val: boolean);
	/**
	 * Set to true if you want the joint's sprites to collide with
	 * each other.
	 * @type {Boolean}
	 * @default false
	 */
	get collideConnected(): boolean;
	/**
	 * Read only. The joint's reaction force.
	 */
	get reactionForce(): any;
	/**
	 * Read only. The joint's reaction torque.
	 */
	get reactionTorque(): any;
	/**
	 * Removes the joint from the world and from each of the
	 * sprites' joints arrays.
	 */
	remove(): void;
}
/**
 * @class
 * @extends Joint
 */
class GlueJoint extends Joint {
	/**
	 * Glue joints are used to glue two sprites together.
	 *
	 * @param {Sprite} spriteA
	 * @param {Sprite} spriteB
	 */
	constructor(spriteA: Sprite, spriteB: Sprite, ...args: any[]);
}
/**
 * @class
 * @extends Joint
 */
class DistanceJoint extends Joint {
	/**
	 * Distance joints are used to constrain the distance
	 * between two sprites.
	 *
	 * @param {Sprite} spriteA
	 * @param {Sprite} spriteB
	 */
	constructor(spriteA: Sprite, spriteB: Sprite, ...args: any[]);
}
/**
 * @class
 * @extends Joint
 */
class WheelJoint extends Joint {
	/**
	 * Wheel joints can be used to create vehicles!
	 *
	 * By default the motor is disabled, angle is 90 degrees,
	 * maxPower is 1000, springiness is 0.1, and damping is 0.7.
	 *
	 * @param {Sprite} spriteA - the vehicle body
	 * @param {Sprite} spriteB - the wheel
	 */
	constructor(spriteA: Sprite, spriteB: Sprite, ...args: any[]);
	set angle(val: number);
	/**
	 * The angle at which the wheel is attached to the vehicle body.
	 *
	 * The default is 90 degrees or PI/2 radians, which is vertical.
	 * @type {Number}
	 * @default 90
	 */
	get angle(): number;
}
/**
 * @class
 * @extends Joint
 */
class HingeJoint extends Joint {
	/**
	 * Hinge joints attach two sprites together at a pivot point,
	 * constraining them to rotate around this point, like a hinge.
	 *
	 * A known as a revolute joint.
	 *
	 * @param {Sprite} spriteA
	 * @param {Sprite} spriteB
	 */
	constructor(spriteA: Sprite, spriteB: Sprite, ...args: any[]);
	set range(val: number);
	/**
	 * The joint's range of rotation. Setting the range
	 * changes the joint's upper and lower limits.
	 * @type {Number}
	 * @default undefined
	 */
	get range(): number;
	set upperLimit(val: number);
	/**
	 * The upper limit of rotation.
	 * @type {Number}
	 * @default undefined
	 */
	get upperLimit(): number;
	set lowerLimit(val: number);
	/**
	 * The lower limit of rotation.
	 * @type {Number}
	 * @default undefined
	 */
	get lowerLimit(): number;
	/**
	 * Read only. The joint's current angle of rotation.
	 * @type {Number}
	 * @default 0
	 */
	get angle(): number;
}
/**
 * @class
 * @extends Joint
 */
class SliderJoint extends Joint {
	/**
	 * A slider joint constrains the motion of two sprites to sliding
	 * along a common axis, without rotation.
	 *
	 * Also known as a prismatic joint.
	 *
	 * @param {Sprite} spriteA
	 * @param {Sprite} spriteB
	 */
	constructor(spriteA: Sprite, spriteB: Sprite, ...args: any[]);
	set angle(val: number);
	/**
	 * The angle of the joint's axis which its sprites slide along.
	 * @type {Number}
	 * @default 0
	 */
	get angle(): number;
	set range(val: number);
	/**
	 * The joint's range of translation. Setting the range
	 * changes the joint's upper and lower limits.
	 * @type {Number}
	 * @default undefined
	 */
	get range(): number;
	set upperLimit(val: number);
	/**
	 * The mathematical upper (not positionally higher)
	 * limit of translation.
	 * @type {Number}
	 * @default undefined
	 */
	get upperLimit(): number;
	set lowerLimit(val: number);
	/**
	 * The mathematical lower (not positionally lower)
	 * limit of translation.
	 * @type {Number}
	 * @default undefined
	 */
	get lowerLimit(): number;
}
/**
 * @class
 * @extends Joint
 */
class RopeJoint extends Joint {
	/**
	 * A Rope joint prevents two sprites from going further
	 * than a certain distance from each other, which is
	 * defined by the max length of the rope, but they do allow
	 * the sprites to get closer together.
	 *
	 * @param {Sprite} spriteA
	 * @param {Sprite} spriteB
	 */
	constructor(spriteA: Sprite, spriteB: Sprite, ...args: any[]);
	set maxLength(val: number);
	/**
	 * The maximum length of the rope.
	 */
	get maxLength(): number;
}
/**
 * @class
 * @extends Joint
 */
class GrabberJoint extends Joint {
	/**
	 * A Grabber joint enables you to grab sprites and move them with
	 * a max force towards a target position.
	 *
	 * @param {Sprite} sprite - the sprite to grab
	 */
	constructor(sprite: Sprite);
	set target(pos: any);
	/**
	 * The target position of the joint that the sprite will be
	 * moved towards. Must be an object with x and y properties.
	 * @type {Object}
	 */
	get target(): any;
	set maxForce(val: number);
	/**
	 * The maximum force that the joint can exert on the sprite.
	 * @type {Number}
	 * @default 1000
	 */
	get maxForce(): number;
}
class Scale {
	valueOf(): any;
}
function colorPal(c: string, palette: number | any): string;
function EmojiImage(emoji: string, textSize: number): new (width?: number, height?: number) => HTMLImageElement;
function spriteArt(txt: string, scale: number, palette: number | any): new (width?: number, height?: number) => HTMLImageElement;
function createSprite(...args: any[]): Sprite;
function createGroup(...args: any[]): Group;
function loadAnimation(...args: any[]): Ani;
function loadAni(...args: any[]): Ani;
function animation(ani: Ani, x: number, y: number, r: number, sX: number, sY: number): void;
function delay(milliseconds: any): Promise<any>;
function sleep(milliseconds: any): Promise<any>;
function play(sound: any): Promise<any>;
let userDisabledP5Errors: boolean;
function createCanvas(...args: any[]): Canvas;
/**
 * @class
 */
class Canvas {
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
	constructor(width?: number, height?: number, options?: any);
	/**
	 * The width of the canvas.
	 * @type {Number}
	 * @default 100
	 */
	w: number;
	/**
	 * The width of the canvas.
	 * @type {Number}
	 * @default 100
	 */
	width: number;
	/**
	 * The height of the canvas.
	 * @type {Number}
	 * @default 100
	 */
	h: number;
	/**
	 * The height of the canvas.
	 * @type {Number}
	 * @default 100
	 */
	height: number;
	/**
	 * Half the width of the canvas.
	 * @type {Number}
	 * @default 50
	 */
	hw: number;
	/**
	 * Half the height of the canvas.
	 * @type {Number}
	 * @default 50
	 */
	hh: number;
	/**
	 * Absolute position of the mouse on the canvas, not relative
	 * to the camera. Same values as `mouseX` and `mouseY`.
	 * @type {Object}
	 * @property {Number} x
	 * @property {Number} y
	 */
	mouse: any;
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
	resize(): void;
	/**
	 * Saves the current canvas as an image file.
	 * @param {String} file - the name of the image
	 */
	save(): void;
}

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
	constructor(func: any, errorNum: any, e: any);
}
var allSprites: Group;
var world: World;
var camera: Camera;
/**
 * @class
 */
class InputDevice {
	/**
	 * The amount of frames an input must be pressed to be considered held.
	 * @type {number}
	 * @default 12
	 */
	holdThreshold: number;
	/**
	 * @param {string} inp
	 * @returns {boolean} true on the first frame that the user presses the input
	 */
	presses(inp: string): boolean;
	/**
	 * @param {string} inp
	 * @returns {number} the amount of frames the user has been pressing the input
	 */
	pressing(inp: string): number;
	/**
	 * Same as the `released` function, which is preferred.
	 * @param {string} inp
	 * @returns {boolean} true on the first frame that the user released the input
	 */
	pressed(inp: string): boolean;
	/**
	 * @param {string} inp
	 * @returns {boolean} true on the first frame that the user holds the input
	 */
	holds(inp: string): boolean;
	/**
	 * @param {string} inp
	 * @returns {number} the amount of frames the user has been holding the input
	 */
	holding(inp: string): number;
	/**
	 * @param {string} inp
	 * @returns {boolean} true on the first frame that the user released a held input
	 */
	held(inp: string): boolean;
	/**
	 * @param {string} inp
	 * @returns {boolean} true on the first frame that the user released the input
	 */
	released(inp: string): boolean;
	releases(inp: any): boolean;
}
/**
 * @class
 * @extends InputDevice
 */
class _Mouse extends InputDevice {
	/**
	 * The mouse's x position in the world.
	 * @type {Number}
	 */
	x: number;
	/**
	 * The mouse's y position in the world.
	 * @type {Number}
	 */
	y: number;
	/**
	 * The mouse's absolute position on the canvas.
	 * @type {object}
	 * @property {Number} x
	 * @property {Number} y
	 */
	canvasPos: object;
	/**
	 * The mouse's left button.
	 * @type {Number}
	 */
	left: number;
	/**
	 * The mouse's center button.
	 * @type {Number}
	 */
	center: number;
	/**
	 * The mouse's right button.
	 * @type {Number}
	 */
	right: number;
	/**
	 * Contains the drag status of each of the mouse's buttons.
	 * @type {object}
	 */
	drag: object;
	/**
	 * True if the mouse is currently on the canvas.
	 * @type {boolean}
	 * @default false
	 */
	isOnCanvas: boolean;
	/**
	 * True if the mouse has ever interacted with the canvas.
	 * @type {boolean}
	 * @default false
	 */
	isActive: boolean;
	/**
	 * The mouse's position.
	 * @type {object}
	 */
	get pos(): object;
	/**
	 * The mouse's position. Alias for pos.
	 * @type {object}
	 */
	get position(): object;
	set cursor(val: string);
	/**
	 * The mouse's CSS cursor style.
	 * @type {string}
	 * @default 'default'
	 */
	get cursor(): string;
	set visible(val: boolean);
	/**
	 * Controls whether the mouse is visible or not.
	 * @type {boolean}
	 * @default true
	 */
	get visible(): boolean;
	/**
	 * @param {string} inp
	 * @returns {boolean} true on the first frame that the user moves the mouse while pressing the input
	 */
	drags(inp: string): boolean;
	/**
	 * @param {string} inp
	 * @returns {number} the amount of frames the user has been moving the mouse while pressing the input
	 */
	dragging(inp: string): number;
	/**
	 * @param {string} inp
	 * @returns {boolean} true on the first frame that the user releases the input after dragging the mouse
	 */
	dragged(inp: string): boolean;
}
var mouse: _Mouse;
/**
 * @class
 * @extends _Mouse
 */
class _SpriteMouse extends _Mouse {
	hover: number;
	/**
	 * @returns {boolean} true on the first frame that the mouse is over the sprite
	 */
	hovers(): boolean;
	/**
	 * @returns {number} the amount of frames the mouse has been over the sprite
	 */
	hovering(): number;
	/**
	 * @returns {boolean} true on the first frame that the mouse is no longer over the sprite
	 */
	hovered(): boolean;
}
/**
 * @class
 * @extends InputDevice
 */
class _Touch extends InputDevice {
	/**
	 * <a href="https://p5play.org/learn/input.html">
	 * Look at the Input reference pages before reading these docs.
	 * </a>
	 *
	 * Used internally to create touch input objects in the `touches` array.
	 */
	constructor(touch: any);
	/**
	 * The touch's x position in the world.
	 * @type {Number}
	 */
	x: number;
	/**
	 * The touch's y position in the world.
	 * @type {Number}
	 */
	y: number;
	/**
	 * The touch's unique identifier.
	 * @type {Number}
	 */
	id: number;
	/**
	 * The amount of frames the user has been touching the screen.
	 * @type {Number}
	 */
	duration: number;
	/**
	 * The amount of frames the user has been dragging on the screen.
	 * @type {Number}
	 */
	drag: number;
	/**
	 * The touch's absolute position on the canvas.
	 * @type {Object}
	 * @property {Number} x
	 * @property {Number} y
	 */
	canvasPos: any;
	force: any;
}
/**
 * @class
 * @extends InputDevice
 */
class _Keyboard extends InputDevice {
	alt: number;
	arrowUp: number;
	arrowDown: number;
	arrowLeft: number;
	arrowRight: number;
	backspace: number;
	capsLock: number;
	control: number;
	enter: number;
	meta: number;
	shift: number;
	tab: number;
	set visible(v: boolean);
	get visible(): boolean;
	get cmd(): number;
	get command(): number;
	get ctrl(): number;
	get space(): any;
	get spacebar(): any;
	get opt(): number;
	get option(): number;
	get win(): number;
	get windows(): number;
}
var kb: _Keyboard;
var keyboard: _Keyboard;
/**
 * @class
 * @extends InputDevice
 */
class Contro extends InputDevice {
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
	constructor(gp: any);
	connected: boolean;
	a: number;
	b: number;
	x: number;
	y: number;
	l: number;
	r: number;
	lt: number;
	rt: number;
	select: number;
	start: number;
	lsb: number;
	rsb: number;
	up: number;
	down: number;
	left: number;
	right: number;
	/**
	 * Has x and y properties with -1 to 1 values which
	 * represent the position of the left analog stick.
	 *
	 * {x: 0, y: 0} is the center position.
	 * @type {Object}
	 */
	leftStick: any;
	/**
	 * Has x and y properties with -1 to 1 values which
	 * represent the position of the right analog stick.
	 *
	 * {x: 0, y: 0} is the center position.
	 * @type {Object}
	 */
	rightStick: any;
	/**
	 * Analog value 0-1 of the left trigger.
	 * @default 0
	 */
	leftTrigger: number;
	/**
	 * Analog value 0-1 of the right trigger.
	 * @default 0
	 */
	rightTrigger: number;
	/**
	 * Button names are mapped to `gamepad.buttons` indices.
	 * @type {Object}
	 */
	buttonMapping: any;
	/**
	 * Sticks and triggers are mapped to `gamepad.axes` indices.
	 * @type {Object}
	 */
	axeMapping: any;
	/**
	 * If the controller is a mock controller.
	 * @type {Boolean}
	 */
	isMock: boolean;
	gamepad: any;
	id: any;
	/**
	 * True if the controller has analog triggers.
	 * False if the controller has digital (button) triggers.
	 * @type {boolean}
	 */
	hasAnalogTriggers: boolean;
	get cross(): number;
	get circle(): number;
	get square(): number;
	get triangle(): number;
	/**
	 * Alias for `leftStick`.
	 */
	get ls(): any;
	/**
	 * Alias for `rightStick`.
	 */
	get rs(): any;
	/**
	 * Alias for `l` (left button).
	 * `lb` is what the button is called on Xbox controllers.
	 */
	get lb(): number;
	/**
	 * Alias for `r` (right button).
	 * `rb` is what the button is called on Xbox controllers.
	 */
	get rb(): number;
	/**
	 * Alias for `l` (left button).
	 * `l1` is what the button is called on PlayStation controllers.
	 */
	get l1(): number;
	/**
	 * Alias for `r` (right button).
	 * `r1` is what the button is called on PlayStation controllers.
	 */
	get r1(): number;
	/**
	 * Alias for `lt` (digital left trigger).
	 * `zl` is what the button is called on Nintendo controllers.
	 */
	get zl(): number;
	/**
	 * Alias for `rt` (digital right trigger).
	 * `zr` is what the button is called on Nintendo controllers.
	 */
	get zr(): number;
	/**
	 * Alias for `leftTrigger` (analog left trigger).
	 * `l2` is what the trigger is called on PlayStation controllers.
	 */
	get l2(): number;
	/**
	 * Alias for `rightTrigger` (analog right trigger).
	 * `r2` is what the trigger is called on PlayStation controllers.
	 */
	get r2(): number;
	/**
	 * Verbose alias for `lsb`.
	 */
	get leftStickButton(): number;
	/**
	 * Verbose alias for `rsb`.
	 */
	get rightStickButton(): number;
	/**
	 * Alias for `lsb` (left stick button).
	 * `l3` is what the trigger is called on PlayStation controllers.
	 */
	get l3(): number;
	/**
	 * Alias for `rsb` (right stick button).
	 * `r3` is what the trigger is called on PlayStation controllers.
	 */
	get r3(): number;
}
/**
 * @class
 * @extends Array<Contro>
 */
class _Contros extends Array<Contro> {
	/**
	 * <a href="https://p5play.org/learn/input.html">
	 * Look at the Input reference pages before reading these docs.
	 * </a>
	 *
	 * Used internally to create the `contros` array (aka `controllers`)
	 * of `Contro` objects, which store the input status of buttons,
	 * triggers, and sticks on game controllers.
	 */
	constructor();
	/**
	 * Swap controller positions in this controllers array.
	 * @param {Number} indexA
	 * @param {Number} indexB
	 * @example
	 * contros.swap(0, 3); // swap the first controller with the fourth
	 */
	swap(indexA: number, indexB: number): void;
	/**
	 * Removes a controller from this controllers array
	 * by setting `contros[index] = null`.
	 *
	 * Newly connected controllers fill the first empty slot.
	 * @param {Number} index
	 */
	remove(index: number): void;
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
	onConnect(gamepad: Gamepad): boolean;
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
	onDisconnect(gamepad: Gamepad): boolean;
}
var contros: _Contros;
var controllers: _Contros;
var contro: Contro;

}
