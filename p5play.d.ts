import * as p5 from 'p5';
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
     * Used for debugging, set to true to make p5play
     * not load any images.
     * @type {Boolean}
     */
    disableImages: boolean;
    /**
     * The default color palette, at index 0 of this array,
     * has all the letters of the English alphabet mapped to colors.
     * @type {Array}
     */
    palettes: any[];
    /**
     * Set to the latest version of p5play v3's
     * minor version number. For example to enable
     * v3.16 features, set this to 16.
     *
     * Some features are not backwards compatible
     * with older versions of p5play, so this
     * variable is used to enable them.
     */
    targetVersion: number;
    os: {};
    context: string;
    hasMouse: boolean;
    standardizeKeyboard: boolean;
}
var p5play: P5Play;
/**
 * @typedef {Object} planck
 * @typedef {Object} planck.Vec2
 * @typedef {Object} planck.Body
 * @typedef {Object} planck.Fixture
 * @typedef {Object} planck.World
 * @typedef {Object} planck.Contact
 */
/**
 * Shortcut for console.log
 * @type {Function}
 * @param {...any} args
 */
const log: Function;
/**
 * @class
 */
class Sprite {
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
     * loaded p5.Image, SpriteAnimation, or name of a SpriteAnimation,
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
    constructor(x?: number, y?: number, w?: number, h?: number, collider?: string, ...args: any[]);
    p: any;
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
     * Keys are the animation label, values are SpriteAnimation objects.
     * @type {SpriteAnimations}
     */
    animations: SpriteAnimations;
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
    /**
     * The tile size is used to change the size of one unit of
     * measurement for the sprite.
     *
     * For example, if the tile size is 16, then a sprite with
     * x=1 and y=1 will be drawn at position (16, 16) on the canvas.
     * @type {Number}
     * @default 1
     */
    tileSize: number;
    set collider(arg: string);
    /**
     * The sprite's collider type. Default is "dynamic".
     *
     * The collider type can be one of the following strings:
     * "dynamic", "static", "kinematic", "none".
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
    get collider(): string;
    set x(arg: number);
    /**
     * The horizontal position of the sprite.
     * @type {Number}
     */
    get x(): number;
    set y(arg: number);
    /**
     * The vertical position of the sprite.
     * @type {Number}
     */
    get y(): number;
    /**
     * Used to detect mouse events with the sprite.
     * @type {_SpriteMouse}
     */
    mouse: _SpriteMouse;
    set shape(arg: string);
    /**
     * The kind of shape: 'box', 'circle', 'chain', or 'polygon'.
     * @type {String}
     * @default box
     */
    get shape(): string;
    set w(arg: number);
    /**
     * The width of the sprite.
     * @type {Number}
     */
    get w(): number;
    set h(arg: number);
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
    set drag(arg: number);
    /**
     * The amount of resistance a sprite has to being moved.
     * @type {Number}
     * @default 0
     */
    get drag(): number;
    set debug(arg: boolean);
    /**
     * If true, an outline of the sprite's collider will be drawn.
     * @type {Boolean}
     * @default false
     */
    get debug(): boolean;
    /**
     * Adds a collider (fixture) to the sprite's physics body.
     *
     * It accepts parameters in a similar format to the Sprite
     * constructor except the first two parameters are x and y offsets,
     * the distance new collider should be from the center of the sprite.
     *
     * This function also recalculates the sprite's mass based on its
     * new size.
     *
     * One limitation of the current implementation is that sprites
     * with multiple colliders can't have their collider
     * type changed without losing every collider added to the
     * sprite besides the first.
     *
     * @param {Number} offsetX distance from the center of the sprite
     * @param {Number} offsetY distance from the center of the sprite
     * @param {Number} w width of the collider
     * @param {Number} h height of the collider
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
     * @param {Number} offsetX distance from the center of the sprite
     * @param {Number} offsetY distance from the center of the sprite
     * @param {Number} w width of the collider
     * @param {Number} h height of the collider
     */
    addSensor(offsetX: number, offsetY: number, w: number, h: number, ...args: any[]): void;
    set mass(arg: number);
    /**
     * The mass of the sprite's physics body.
     * @type {Number}
     */
    get mass(): number;
    set rotation(arg: number);
    /**
     * The angle of the sprite's rotation, not the direction it's moving.
     * @type {Number}
     * @default 0
     */
    get rotation(): number;
    set vel(arg: p5.Vector);
    /**
     * The sprite's velocity vector {x, y}
     * @type {p5.Vector}
     * @default {x: 0, y: 0}
     */
    get vel(): p5.Vector;
    /**
     * Removes the physics body colliders from the sprite but not
     * overlap sensors.
     */
    removeColliders(): void;
    /**
     * Removes overlap sensors from the sprite.
     */
    removeSensors(): void;
    set animation(arg: SpriteAnimation);
    /**
     * Reference to the sprite's current animation.
     * @type {SpriteAnimation}
     */
    get animation(): SpriteAnimation;
    set ani(arg: SpriteAnimation);
    /**
     * Reference to the sprite's current animation.
     * @type {SpriteAnimation}
     */
    get ani(): SpriteAnimation;
    /**
     * Keys are the animation label, values are SpriteAnimation objects
     * @type {SpriteAnimations}
     */
    get anis(): SpriteAnimations;
    set autoDraw(arg: boolean);
    /**
     * autoDraw is a property of all groups that controls whether
     * a group is automatically drawn to the screen after the end
     * of each draw cycle.
     *
     * It only needs to be set to false once and then it will
     * remain false for the rest of the sketch, unless changed.
     * @type {Boolean}
     * @default true
     */
    get autoDraw(): boolean;
    set allowSleeping(arg: boolean);
    /**
     * This property disables the ability for a sprite to "sleep".
     *
     * "Sleeping" sprites are not included in the physics simulation, a
     * sprite starts "sleeping" when it stops moving and doesn't collide
     * with anything that it wasn't already touching.
     * @type {Boolean}
     * @default true
     */
    get allowSleeping(): boolean;
    set autoUpdate(arg: boolean);
    /**
     * autoUpdate is a property of all groups that controls whether
     * a group is automatically updated after the end of each draw
     * cycle.
     *
     * It only needs to be set to false once and then it will
     * remain false for the rest of the sketch, unless changed.
     * @type {Boolean}
     * @default true
     */
    get autoUpdate(): boolean;
    set bounciness(arg: number);
    /**
     * The bounciness of the sprite's physics body.
     * @type {Number}
     * @default 0.2
     */
    get bounciness(): number;
    /**
     * The center of mass of the sprite's physics body.
     * @type {p5.Vector}
     */
    get centerOfMass(): p5.Vector;
    set color(arg: p5.Color);
    /**
     * The sprite's current color. By default sprites get a random color.
     * @type {p5.Color}
     * @default random color
     */
    get color(): p5.Color;
    set colour(arg: p5.Color);
    /**
     * Alias for color. colour is the British English spelling.
     * @type {p5.Color}
     * @default random color
     */
    get colour(): p5.Color;
    set fill(arg: p5.Color);
    /**
     * Alias for sprite.fillColor
     * @type {p5.Color}
     * @default random color
     */
    get fill(): p5.Color;
    set fillColor(arg: p5.Color);
    /**
     * Alias for sprite.color
     * @type {p5.Color}
     * @default random color
     */
    get fillColor(): p5.Color;
    set stroke(arg: p5.Color);
    /**
     * Alias for sprite.strokeColor
     * @type {p5.Color}
     */
    get stroke(): p5.Color;
    set strokeColor(arg: p5.Color);
    /**
     * Overrides sprite's stroke color. By default the stroke of a sprite
     * is determined by its collider type, which can also be overridden by the
     * sketch's stroke color.
     * @type {p5.Color}
     */
    get strokeColor(): p5.Color;
    set strokeWeight(arg: number);
    /**
     * The sprite's stroke weight, the thickness of its outline.
     * @type {Number}
     * @default undefined
     */
    get strokeWeight(): number;
    set textColor(arg: p5.Color);
    /**
     * The sprite's text fill color. Black by default.
     * @type {p5.Color}
     * @default black (#000000)
     */
    get textColor(): p5.Color;
    set textColour(arg: any);
    get textColour(): any;
    set textFill(arg: p5.Color);
    /**
     * The sprite's text fill color. Black by default.
     * @type {p5.Color}
     * @default black (#000000)
     */
    get textFill(): p5.Color;
    set textSize(arg: number);
    /**
     * The sprite's text size, the sketch's current textSize by default.
     * @type {Number}
     */
    get textSize(): number;
    set textStroke(arg: p5.Color);
    /**
     * The sprite's text stroke color.
     * No stroke by default, does not inherit from the sketch's stroke color.
     * @type {p5.Color}
     * @default undefined
     */
    get textStroke(): p5.Color;
    set textStrokeWeight(arg: number);
    /**
     * The sprite's text stroke weight, the thickness of its outline.
     * No stroke by default, does not inherit from the sketch's stroke weight.
     * @type {Number}
     * @default undefined
     */
    get textStrokeWeight(): number;
    set bearing(arg: number);
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
    set density(arg: number);
    /**
     * The density of the sprite's physics body.
     * @type {Number}
     * @default 5
     */
    get density(): number;
    set direction(arg: number);
    /**
     * The angle of the sprite's movement or it's rotation angle if the
     * sprite is not moving.
     * @type {Number}
     * @default 0 ("right")
     */
    get direction(): number;
    set draw(arg: Function);
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
     * @type {Function}
     * @example
     * sprite.draw = function() {
     *   // an oval
     *   ellipse(0,0,20,10);
     * }
     *
     */
    get draw(): Function;
    set dynamic(arg: boolean);
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
    set friction(arg: number);
    /**
     * The amount the sprite's physics body resists moving
     * when rubbing against another physics body.
     * @type {Number}
     * @default 0.5
     */
    get friction(): number;
    set heading(arg: string);
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
    set img(arg: p5.Image);
    /**
     * A reference to the sprite's current image.
     * @type {p5.Image}
     */
    get img(): p5.Image;
    set image(arg: p5.Image);
    /**
     * A reference to the sprite's current image.
     * @type {p5.Image}
     */
    get image(): p5.Image;
    /**
     * Read only. True if the sprite is moving.
     * @type {Boolean}
     */
    get isMoving(): boolean;
    set isSuperFast(arg: boolean);
    /**
     * Set this to true if the sprite goes really fast to prevent
     * inaccurate physics simulation.
     * @type {Boolean}
     * @default false
     */
    get isSuperFast(): boolean;
    set kinematic(arg: boolean);
    /**
     * True if the sprite's physics body is kinematic.
     * @type {Boolean}
     * @default false
     */
    get kinematic(): boolean;
    set layer(arg: number);
    /**
     * By default sprites are drawn in the order they were created in.
     * You can change the draw order by editing sprite's layer
     * property. Sprites with the highest layer value get drawn first.
     * @type {Number}
     */
    get layer(): number;
    set life(arg: number);
    /**
     * The number of frame cycles before the sprite is removed.
     *
     * Set it to initiate a countdown, every draw cycle the value is
     * reduced by 1 unit. If it becomes less than or equal to 0, the
     * sprite will be removed.
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
    get massData(): {
        I: number;
        center: any;
        mass: number;
    };
    /**
     * Recalculates the sprite's mass based on its current
     * density and size.
     */
    resetMass(): void;
    set mirror(arg: any);
    /**
     * The sprite's mirror states.
     * @type {Object}
     * @property {Boolean} x - the sprite's horizontal mirror state
     * @property {Boolean} y - the sprite's vertical mirror state
     * @default {x: false, y: false}
     */
    get mirror(): any;
    set offset(arg: any);
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
    get offset(): any;
    set previousPosition(arg: any);
    /**
     * Verbose alias for sprite.prevPos
     * @type {Object}
     */
    get previousPosition(): any;
    set previousRotation(arg: number);
    /**
     * Verbose alias for sprite.prevRotation
     * @type {Number}
     */
    get previousRotation(): number;
    set pixelPerfect(arg: boolean);
    /**
     * By default p5play draws sprites with subpixel rendering.
     *
     * Set pixelPerfect to true to make p5play always display sprites
     * at integer pixel precision. This is useful for making retro games.
     * @type {Boolean}
     * @default false
     */
    get pixelPerfect(): boolean;
    set rotationDrag(arg: number);
    /**
     * The amount the sprite resists rotating.
     * @type {Number}
     * @default 0
     */
    get rotationDrag(): number;
    set rotationLock(arg: boolean);
    /**
     * If true, the sprite can not rotate.
     * @type {Boolean}
     * @default false
     */
    get rotationLock(): boolean;
    set rotationSpeed(arg: number);
    /**
     * The speed of the sprite's rotation.
     * @type {Number}
     * @default 0
     */
    get rotationSpeed(): number;
    set scale(arg: any);
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
    get scale(): any;
    set sleeping(arg: boolean);
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
    set speed(arg: number);
    /**
     * The sprite's speed.
     *
     * Setting speed to a negative value will make the sprite move
     * 180 degrees opposite of its current direction angle.
     * @type {Number}
     * @default 0
     */
    get speed(): number;
    set static(arg: boolean);
    /**
     * Is the sprite's physics collider static?
     * @type {Boolean}
     * @default false
     */
    get static(): boolean;
    set removed(arg: boolean);
    /**
     * If the sprite has been removed from the world.
     * @type {Boolean}
     * @default false
     */
    get removed(): boolean;
    /**
     * The sprite's vertices, in vertex mode format.
     * @type {Array}
     */
    set vertices(arg: any[]);
    get vertices(): any[];
    set visible(arg: boolean);
    /**
     * If true the sprite is shown, if set to false the sprite is hidden.
     *
     * Becomes null when the sprite is off screen but will be drawn and
     * set to true again if it goes back on screen.
     * @type {Boolean}
     * @default true
     */
    get visible(): boolean;
    set pos(arg: p5.Vector);
    /**
     * The position vector {x, y}
     * @type {p5.Vector}
     */
    get pos(): p5.Vector;
    set position(arg: p5.Vector);
    /**
     * The position vector {x, y}
     * @type {p5.Vector}
     */
    get position(): p5.Vector;
    set hw(arg: number);
    /**
     * Half the width of the sprite.
     * @type {Number}
     */
    get hw(): number;
    set width(arg: number);
    /**
     * The width of the sprite.
     * @type {Number}
     */
    get width(): number;
    set halfWidth(arg: number);
    /**
     * Half the width of the sprite.
     * @type {Number}
     */
    get halfWidth(): number;
    set hh(arg: number);
    /**
     * Half the height of the sprite.
     * @type {Number}
     */
    get hh(): number;
    set height(arg: number);
    /**
     * The height of the sprite.
     * @type {Number}
     */
    get height(): number;
    set halfHeight(arg: number);
    /**
     * Half the height of the sprite.
     * @type {Number}
     */
    get halfHeight(): number;
    set d(arg: number);
    /**
     * The diameter of a circular sprite.
     * @type {Number}
     */
    get d(): number;
    set diameter(arg: number);
    /**
     * The diameter of a circular sprite.
     * @type {Number}
     */
    get diameter(): number;
    set r(arg: number);
    /**
     * The radius of a circular sprite.
     * @type {Number}
     */
    get r(): number;
    set radius(arg: number);
    /**
     * The radius of a circular sprite.
     * @type {Number}
     */
    get radius(): number;
    set update(arg: Function);
    /**
     * You can set the sprite's update function to a custom
     * update function which by default, will be run after every p5.js
     * draw call.
     *
     * This function updates the sprite's animation, mouse, and
     *
     * There's no way to individually update a sprite or group
     * of sprites in the physics simulation though.
     * @type {Function}
     */
    get update(): Function;
    /**
     * The sprite's velocity vector {x, y}
     * @type {p5.Vector}
     * @default {x: 0, y: 0}
     */
    set velocity(arg: any);
    get velocity(): any;
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
    applyForce(x: any, y: any, originX: any, originY: any, ...args: any[]): void;
    /**
     * Applies a force that's scaled to the sprite's mass.
     *
     * @param {Number} amount
     * @param {Vector} [origin]
     */
    applyForceScaled(...args: any[]): void;
    /**
     * Applies a force to the sprite's center of mass attracting it to
     * the given position.
     *
     * Radius and easing not implemented yet!
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} force
     * @param {Number} [radius] infinite if not given
     * @param {Number} [easing] solid if not given
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
     * @param {Number} torque The amount of torque to apply.
     */
    applyTorque(val: any): void;
    /**
     * Moves a sprite towards a position at a percentage of the distance
     * between itself and the destination.
     *
     * @param {Number|Object} x destination x or any object with x and y properties
     * @param {Number} [y] destination y
     * @param {Number} [tracking] 1 represents 1:1 tracking, the mouse moves to the destination immediately, 0 represents no tracking. Default is 0.1 (10% tracking).
     */
    moveTowards(x: number | any, y?: number, tracking?: number): void;
    /**
     * Moves the sprite away from a position, the opposite of moveTowards,
     * at a percentage of the distance between itself and the position.
     * @param {Number} x
     * @param {Number} [y]
     * @param {Number} [repel] range from 0-1
     */
    moveAway(x: number, y?: number, repel?: number, ...args: any[]): void;
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
     */
    move(distance: number, direction: number | string, speed: number, ...args: any[]): Promise<any>;
    /**
     * Move the sprite to a position.
     *
     * @param {Number|Object} x|position destination x or any object with x and y properties
     * @param {Number} y destination y
     * @param {Number} speed [optional]
     * @returns {Promise} resolves to true when the movement is complete
     * or to false if the sprite will not reach its destination
     */
    moveTo(x: number | any, y: number, speed: number): Promise<any>;
    /**
     * Rotates the sprite towards an angle or position
     * with x and y properties.
     *
     * @param {Number|Object} angle|position angle in degrees or an object with x and y properties
     * @param {Number} tracking percent of the distance to rotate on each frame towards the target angle, default is 0.1 (10%)
     * @param {Number} facing (only if position is given) rotation angle the sprite should be at when "facing" the position, default is 0
     */
    rotateTowards(angle: number | any, tracking: number, ...args: any[]): void;
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
    angleTo(x: number, y: number): number;
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
    angleToFace(x: number, y: number, facing: number): number;
    /**
     * Rotates the sprite to an angle or to face a position.
     *
     * @param {Number|Object} angle|position
     * @param {Number} speed the amount of rotation per frame, default is 1
     * @param {Number} facing (only if position is given) the rotation angle the sprite should be at when "facing" the position, default is 0
     * @returns {Promise} a promise that resolves when the rotation is complete
     */
    rotateTo(angle: number | any, speed: number, ...args: any[]): Promise<any>;
    /**
     * Rotates the sprite by an amount at a specified angles per frame speed.
     *
     * @param {Number} angle the amount to rotate the sprite
     * @param {Number} speed the amount of rotation per frame, default is 1
     * @returns {Promise} a promise that resolves when the rotation is complete
     */
    rotate(angle: number, speed: number): Promise<any>;
    /**
     * Changes the sprite's animation. Use `addAni` to define the
     * animation(s) first.
     *
     * @param {...String} anis the names of one or many animations to be played in
     * sequence
     * @returns A promise that fulfills when the animation or sequence of animations
     * completes
     */
    changeAni(...args: string[]): Promise<void>;
    /**
     * Changes the sprite's animation. Use `addAni` to define the
     * animation(s) first. Alt for `changeAni`.
     *
     * @param {...String} anis the names of one or many animations to be played in
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
}
function Turtle(size: any): any;
/**
 * @class
 * @extends Array<p5.Image>
 */
class SpriteAnimation extends Array<p5.Image> {
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
    constructor(...args: p5.Image[]);
    p: any;
    /**
     * The name of the animation
     * @type {String}
     */
    name: string;
    /**
     * The index of the current frame that the animation is on.
     * @type {Number}
     */
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
    set frame(arg: number);
    get frame(): number;
    set frameDelay(arg: number);
    /**
     * Delay between frames in number of draw cycles.
     * If set to 4 the framerate of the animation would be the
     * sketch framerate divided by 4 (60fps = 15fps)
     * @type {Number}
     * @default 4
     */
    get frameDelay(): number;
    set scale(arg: any);
    /**
     * TODO frameRate
     * Another way to set the animation's frame delay.
     */
    /**
     * The animation's scale.
     *
     * Can be set to a number to scale both x and y
     * or an object with x and/or y properties.
     * @type {Number|Object}
     * @default 1
     */
    get scale(): any;
    /**
     * Make a copy of the animation.
     *
     * @return {SpriteAnimation} A copy of the animation.
     */
    clone(): SpriteAnimation;
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
     * @param {Number} toFrame Frame number destination (starts from 0)
     * @returns [Promise] a promise that resolves when the animation completes
     */
    goToFrame(toFrame: number): Promise<any>;
    /**
     * The index of the last frame. Read only.
     * @type {Number}
     */
    get lastFrame(): number;
    /**
     * The current frame as p5.Image. Read only.
     * @type {p5.Image}
     */
    get frameImage(): p5.Image;
    /**
     * Width of the animation.
     * @type {Number}
     */
    get w(): number;
    /**
     * Width of the animation.
     * @type {Number}
     */
    get width(): number;
    /**
     * Height of the animation.
     * @type {Number}
     */
    get h(): number;
    /**
     * Height of the animation.
     * @type {Number}
     */
    get height(): number;
    /**
     * Deprecated. Use the animation object itself, which is an array of frames.
     *
     * The frames of the animation. Read only.
     * @deprecated
     * @type {p5.Image[]}
     */
    get frames(): p5.Image[];
}
/**
 * This SpriteAnimations class serves the same role that Group does
 * for Sprites. This class is used interally to create `sprite.anis`
 * and `group.anis`. It's not intended to be used directly by p5play users.
 *
 * In instance objects of this class, the keys are animation names,
 * values are SpriteAnimation objects.
 *
 * Because users only expect instances of this class to contain
 * animation names as keys, it uses an internal private object
 * `#_` to store animation properties. Getters and setters are used to
 * access the private properties, enabling dynamic inheritance.
 *
 * @private
 */
class SpriteAnimations {
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
     * A Group is a collection of sprites with similar traits and behaviors.
     *
     * For example a group may contain all the coin sprites that the
     * player can collect.
     *
     * Group extends Array. You can use them in for loops just like arrays
     * since they inherit all the functions and properties of standard
     * arrays such as `group.length` and functions like `group.includes()`.
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
    constructor(...args: any[]);
    p: any;
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
     * @type {p5.Vector}
     */
    offset: p5.Vector;
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
     * @type {p5.Vector}
     */
    scale: p5.Vector;
    /**
     * @type {Number}
     */
    shape: number;
    /**
     * @type {Boolean}
     */
    sleeping: boolean;
    /**
     * @type {p5.Color}
     */
    stroke: p5.Color;
    /**
     * @type {Number}
     */
    strokeWeight: number;
    /**
     * @type {Number}
     */
    text: number;
    /**
     * @type {p5.Color}
     */
    textColor: p5.Color;
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
     * @type {Number}
     */
    diameter: number;
    /**
     * @type {Boolean}
     */
    dynamic: boolean;
    /**
     * @type {Number}
     */
    height: number;
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
     * @type {Number}
     */
    width: number;
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
    subgroups: {}[];
    parent: any;
    /**
     * Keys are the animation label, values are SpriteAnimation objects.
     * @type {SpriteAnimations}
     */
    animations: SpriteAnimations;
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
     * Adds a sprite to the end of the group.
     *
     * Alias for `push`, the standard JS Array function for
     * adding to an array.
     *
     * @memberof Group
     * @instance
     * @func add
     * @param {...Sprite} sprites
     * @return {Number} The new length of the group
     */
    add: (...sprites: Sprite[]) => number;
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
    contains: (searchElement: Sprite, fromIndex?: number) => boolean;
    set ani(arg: SpriteAnimation);
    /**
     * Reference to the group's current animation.
     * @type {SpriteAnimation}
     */
    get ani(): SpriteAnimation;
    set animation(arg: SpriteAnimation);
    /**
     * Reference to the group's current animation.
     * @type {SpriteAnimation}
     */
    get animation(): SpriteAnimation;
    /**
     * The group's animations.
     * @type {SpriteAnimations}
     */
    get anis(): SpriteAnimations;
    set img(arg: p5.Image);
    /**
     * Reference to the group's current image.
     * @type {p5.Image}
     */
    get img(): p5.Image;
    set image(arg: p5.Image);
    /**
     * Reference to the group's current image.
     * @type {p5.Image}
     */
    get image(): p5.Image;
    /**
     * Depending on the value that the amount property is set to, the group will
     * either add or remove sprites.
     * @type {Number}
     */
    set amount(arg: any);
    set velocity(arg: p5.Vector);
    /**
     * The sprite's velocity vector {x, y}
     * @type {p5.Vector}
     * @default {x: 0, y: 0}
     */
    get velocity(): p5.Vector;
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
     * Alias for group.length
     * @deprecated
     */
    size(): number;
    /**
     * Remove sprites that go outside the given culling boundary
     * relative to the camera.
     *
     * Sprites with chain colliders can not be culled.
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
    cull(top: number, bottom: number, left?: number, right?: number, cb?: Function): number;
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
     * @param {Sprite|Number} item The sprite to be removed or its index
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
     * @param {Number} idx index
     * @param {Number} amount number of sprites to remove
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
     * Draws all the sprites in the group.
     */
    draw(): void;
    /**
     * Updates all the sprites in the group. See sprite.update for
     * more information.
     *
     * By default, allSprites.update is called after every draw call.
     *
     */
    update(): void;
}
class World {
    p: any;
    mod: any[];
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
    set velocityThreshold(arg: number);
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
    mouseSprite: any;
    mouseSprites: any[];
    autoStep: boolean;
    set gravity(arg: any);
    /**
     * Gravity force vector that affects all dynamic physics colliders.
     * @type {Object}
     * @property {Number} x
     * @property {Number} y
     * @default { x: 0, y: 0 }
     */
    get gravity(): any;
    /**
     * Performs a physics simulation step that advances all sprites'
     * forward in time by 1/60th of a second if no timeStep is given.
     *
     * This function is automatically called at the end of the p5.js draw
     * loop, unless it was already called inside the draw loop.
     *
     * Decreasing velocityIterations and positionIterations will improve
     * performance but decrease simulation quality.
     *
     * @param {Number} [timeStep] - time step in seconds
     * @param {Number} [velocityIterations] - 8 by default
     * @param {Number} [positionIterations] - 3 by default
     */
    step(timeStep?: number, velocityIterations?: number, positionIterations?: number): void;
    /**
     * Returns the sprites at a position, ordered by layer.
     *
     * Optionally you can specify a group to search.
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Group} [group] the group to search
     * @param {Boolean} [cameraActiveWhenDrawn] if true, only sprites that
     * were drawn when the camera was active will be returned
     * @returns {Sprite[]} an array of sprites
     */
    getSpritesAt(x: number, y: number, group?: Group, cameraActiveWhenDrawn?: boolean): Sprite[];
    /**
     * Returns the sprite at the specified position
     * on the top most layer.
     *
     * Optionally you can specify a group to search.
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Group} [group] the group to search
     * @returns {Sprite} a sprite
     */
    getSpriteAt(x: number, y: number, group?: Group): Sprite;
    getMouseSprites(): Sprite[];
    set allowSleeping(arg: boolean);
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
}
class Camera {
    p: any;
    /**
     * Absolute position of the mouse. Same values as p5.js `mouseX` and `mouseY`.
     * @type {Object}
     * @property {Number} x
     * @property {Number} y
     */
    mouse: any;
    /**
     * Read only. True if the camera is active.
     * Use the methods Camera.on() and Camera.off()
     * to enable or disable the camera.
     * @type {Boolean}
     * @default false
     */
    active: boolean;
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
    set pos(arg: any);
    /**
     * The camera's position. {x, y}
     * @type {Object}
     */
    get pos(): any;
    set x(arg: number);
    /**
     * The camera x position.
     * @type {Number}
     */
    get x(): number;
    set y(arg: number);
    /**
     * The camera y position.
     * @type {Number}
     */
    get y(): number;
    set position(arg: any);
    /**
     * The camera's position. Alias for pos.
     * @type {Object}
     */
    get position(): any;
    set zoom(arg: number);
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
     * @param {Number} target The target zoom
     * @param {Number} speed The amount of zoom per frame
     * @returns {Promise} resolves true when the camera reaches the target zoom
     */
    zoomTo(target: number, speed: number): Promise<any>;
    /**
     * Activates the camera.
     * The canvas will be drawn according to the camera position and scale until
     * camera.off() is called
     *
     */
    on(): void;
    /**
     * Deactivates the camera.
     * The canvas will be drawn normally, ignoring the camera's position
     * and scale until camera.on() is called
     *
     */
    off(): void;
}
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
class Joint {
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
    constructor(spriteA: Sprite, spriteB: Sprite, type?: string);
    p: any;
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
    set draw(arg: Function);
    /**
     * Function that draws the joint. Can be overridden by the user.
     * @type {Function}
     * @param {Number} xA
     * @param {Number} yA
     * @param {Number} [xB]
     * @param {Number} [yB]
     */
    get draw(): Function;
    set offsetA(arg: p5.Vector);
    /**
     * Offset to the joint's anchorA position from the center of spriteA.
     *
     * Only distance and hinge joints have an offsetA.
     * @type {p5.Vector}
     * @default {x: 0, y: 0}
     */
    get offsetA(): p5.Vector;
    set offsetB(arg: p5.Vector);
    /**
     * Offset to the joint's anchorB position from the center of spriteB.
     *
     * Only distance, hinge, and wheel joints have an offsetB.
     * @type {p5.Vector}
     * @default {x: 0, y: 0}
     */
    get offsetB(): p5.Vector;
    set springiness(arg: number);
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
    set damping(arg: number);
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
    set speed(arg: number);
    /**
     * The current speed of the joint's motor.
     * @type {Number}
     * @default 0
     */
    get speed(): number;
    get motorSpeed(): any;
    set enableMotor(arg: boolean);
    /**
     * Enable or disable the joint's motor.
     * Disabling the motor is like putting a
     * car in neutral.
     * @type {Boolean}
     */
    get enableMotor(): boolean;
    set maxPower(arg: number);
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
    set collideConnected(arg: boolean);
    /**
     * Set to true if you want the joint's sprites to collide with
     * each other.
     * @type {Boolean}
     * @default false
     */
    get collideConnected(): boolean;
    /**
     * Removes the joint from the world and from each of the
     * sprites' joints arrays.
     */
    remove(): void;
}
class GlueJoint extends Joint {
    /**
     * Glue joints are used to glue two sprites together.
     *
     * @param {Sprite} spriteA
     * @param {Sprite} spriteB
     */
    constructor(spriteA: Sprite, spriteB: Sprite, ...args: any[]);
}
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
class WheelJoint extends Joint {
    /**
     * Wheel joints can be used to create vehicles!
     *
     * By default the motor is disabled, angle is 90 degrees,
     * maxPower is 1000, springiness is 0.1, and damping is 0.7.
     *
     * @param {Sprite} spriteA the vehicle body
     * @param {Sprite} spriteB the wheel
     */
    constructor(spriteA: Sprite, spriteB: Sprite, ...args: any[]);
    set angle(arg: number);
    /**
     * The angle at which the wheel is attached to the vehicle body.
     *
     * The default is 90 degrees or PI/2 radians, which is vertical.
     * @type {Number}
     * @default 90
     */
    get angle(): number;
}
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
    set range(arg: number);
    /**
     * The joint's range of rotation. Setting the range
     * changes the joint's upper and lower limits.
     * @type {Number}
     * @default undefined
     */
    get range(): number;
    set upperLimit(arg: number);
    /**
     * The upper limit of rotation.
     * @type {Number}
     * @default undefined
     */
    get upperLimit(): number;
    set lowerLimit(arg: number);
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
var RevoluteJoint: any;
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
    set angle(arg: number);
    /**
     * The angle of the joint's axis which its sprites slide along.
     * @type {Number}
     * @default 0
     */
    get angle(): number;
    set range(arg: number);
    /**
     * The joint's range of translation. Setting the range
     * changes the joint's upper and lower limits.
     * @type {Number}
     * @default undefined
     */
    get range(): number;
    set upperLimit(arg: number);
    /**
     * The mathematical upper (not positionally higher)
     * limit of translation.
     * @type {Number}
     * @default undefined
     */
    get upperLimit(): number;
    set lowerLimit(arg: number);
    /**
     * The mathematical lower (not positionally lower)
     * limit of translation.
     * @type {Number}
     * @default undefined
     */
    get lowerLimit(): number;
}
var PrismaticJoint: any;
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
    set maxLength(arg: number);
    /**
     * The maximum length of the rope.
     */
    get maxLength(): number;
}
class Scale {
    valueOf(): any;
}
function encodeFloat16(v: any): number;
function colorPal(c: string, palette: number | any): string;
function spriteArt(txt: string, scale: number, palette: number | any): p5.Image;
function createSprite(...args: any[]): Sprite;
function createGroup(...args: any[]): Group;
function loadAnimation(...args: any[]): SpriteAnimation;
function loadAni(...args: any[]): SpriteAnimation;
function animation(ani: SpriteAnimation, x: number, y: number, r: number, sX: number, sY: number): void;
function delay(millisecond: number): Promise<any>;
function sleep(millisecond: any): Promise<any>;
function play(sound: any): Promise<any>;
let userDisabledP5Errors: boolean;
var canvas: any;
function createCanvas(...args: any[]): any;
class Canvas {
    /**
     * Creates a p5.js canvas element. Includes some extra features such as
     * a pixelated mode. It can also use ratios instead of setting width and
     * height directly. See the Canvas learn page for more information.
     *
     * @param {Number} w width of the canvas
     * @param {Number} h height of the canvas
     * @param {String} [mode] 'pixelated' or 'fullscreen'
     * @example
     * new Canvas(400, 400);
     *
     * new Canvas('16:9');
     */
    constructor(w: number, h: number, mode?: string);
    /**
     * The width of the canvas.
     * @type {Number}
     * @default 100
     */
    get w(): number;
    /**
     * The width of the canvas.
     * @type {Number}
     * @default 100
     */
    get width(): number;
    /**
     * The height of the canvas.
     * @type {Number}
     * @default 100
     */
    get h(): number;
    /**
     * The height of the canvas.
     * @type {Number}
     * @default 100
     */
    get height(): number;
    /**
     * Resizes the canvas, the world, and centers the camera.
     *
     * Visually the canvas will shrink or extend to the new size. Sprites
     * will not change position.
     *
     * If you would prefer to keep the camera focused on the same area, then
     * you must manually adjust the camera position after calling this
     * function.
     *
     * @param {Number} w - The new width of the canvas.
     * @param {Number} h - The new height of the canvas.
     */
    resize(): void;
}
function resizeCanvas(w: any, h: any): void;
function background(...args: any[]): void;
function fill(...args: any[]): void;
function stroke(...args: any[]): void;
function loadImage(...args: any[]): any;
function loadImg(...args: any[]): any;
function image(...args: any[]): void;
/**
 * Enables or disables text caching.
 * @param {Boolean} b
 * @param {Number} maxSize
 */
function textCache(b: boolean, maxSize: number): boolean;
/**
 * Creates an image from text.
 * @param {String} str
 * @param {Number} w line width limit
 * @param {Number} h height limit
 * @returns {p5.Image}
 */
function createTextImage(str: string, w: number, h: number): p5.Image;
/**
 * Displays text on the canvas.
 *
 * @param {String} str text to display
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w line width limit
 * @param {Number} h height limit
 */
function text(str: string, x: number, y: number, w: number, h: number): any;
/**
 * Displays an image based on text alignment settings.
 * @param {p5.Image} img
 * @param {Number} x
 * @param {Number} y
 */
function textImage(img: p5.Image, x: number, y: number): void;
/**
 * A FriendlyError is a custom error class that extends the native JS
 * Error class. It's used internally by p5play to make error messages
 * more helpful.
 *
 * @private
 * @param {String} func the name of the function the error was thrown in
 * @param {Number} errorNum the error's code number
 * @param {Array} e an array of values relevant to the error
 */
class FriendlyError extends Error {
    constructor(func: any, errorNum: any, e: any);
}
var allSprites: Group;
var world: World;
var camera: Camera;
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
class _Mouse extends InputDevice {
    /**
     * The mouse's x position.
     * @type {Number}
     */
    x: number;
    /**
     * The mouse's y position.
     * @type {Number}
     */
    y: number;
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
     * Whether the mouse is currently on the canvas or not.
     * @type {boolean}
     * @default false
     */
    isOnCanvas: boolean;
    /**
     * True if the mouse has ever interacted with the canvas.
     * @type {boolean}
     * @default false
     */
    active: boolean;
    update(): void;
    /**
     * The mouse's position.
     * @type {object}
     */
    get pos(): any;
    /**
     * The mouse's position. Alias for pos.
     * @type {object}
     */
    get position(): any;
    set cursor(arg: string);
    /**
     * The mouse's CSS cursor style.
     * @type {string}
     * @default 'default'
     */
    get cursor(): string;
    set visible(arg: boolean);
    /**
     * Controls whether the mouse is visible or not.
     * @type {boolean}
     * @default true
     */
    get visible(): boolean;
    /**
     * @param {string} inp
     * @returns {boolean} true on the first frame that the user reaches the holdThreshold for holding the input and could start to drag
     */
    drags(inp: string): boolean;
    /**
     * @param {string} inp
     * @returns {number} the amount of frames the user has been dragging while pressing the input
     */
    dragging(inp: string): number;
    /**
     * @param {string} inp
     * @returns {boolean} true on the first frame that the user releases the input after dragging
     */
    dragged(inp: string): boolean;
}
var mouse: _Mouse;
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
class _KeyBoard extends InputDevice {
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
    get cmd(): number;
    get command(): number;
    get ctrl(): number;
    get space(): any;
    get spacebar(): any;
    get opt(): number;
    get option(): number;
    get win(): number;
    get windows(): number;
    #private;
}
var kb: _KeyBoard;
var keyboard: _KeyBoard;
class _Contro extends InputDevice {
    /**
     * <a href="https://p5play.org/learn/input_devices.html">
     * Look at the Input reference pages before reading these docs.
     * </a>
     *
     * Used to create controller objects in the `controllers` array
     * (aka `contro`), these objects store the input status of buttons,
     * triggers, and sticks on game controllers.
     */
    constructor(gp: any);
    connected: boolean;
    leftStick: {
        x: number;
        y: number;
    };
    rightStick: {
        x: number;
        y: number;
    };
    gamepad: any;
    id: any;
    leftTrigger: any;
    rightTrigger: any;
    get ls(): {
        x: number;
        y: number;
    };
    get rs(): {
        x: number;
        y: number;
    };
    get lb(): any;
    get rb(): any;
    get leftStickButton(): any;
    get rightStickButton(): any;
}
/**
 * @class
 * @extends Array<_Contro>
 */
class _Contros extends Array<_Contro> {
    /**
     * <a href="https://p5play.org/learn/input_devices.html">
     * Look at the Input reference pages before reading these docs.
     * </a>
     *
     * Used to create `controllers` (aka `contro`) an array
     * of `_Contro` objects, which store the input status of buttons,
     * triggers, and sticks on game controllers.
     */
    constructor();
    /**
     * @type {Function}
     */
    presses: Function;
    /**
     * @type {Function}
     */
    pressing: Function;
    /**
     * @type {Function}
     */
    pressed: Function;
    /**
     * @type {Function}
     */
    holds: Function;
    /**
     * @type {Function}
     */
    holding: Function;
    /**
     * @type {Function}
     */
    held: Function;
    /**
     * @type {Function}
     */
    released: Function;
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
     * Analog value 0-1 of the left trigger.
     */
    leftTrigger: number;
    /**
     * Analog value 0-1 of the right trigger.
     */
    rightTrigger: number;
    lb: number;
    rb: number;
    leftStickButton: number;
    rightStickButton: number;
    /**
     * Has x and y properties with -1 to 1 values which
     * represent the position of the left stick.
     *
     * {x: 0, y: 0} is the center position.
     * @type {Object}
     */
    leftStick: any;
    /**
     * Has x and y properties with -1 to 1 values which
     * represent the position of the right stick.
     *
     * {x: 0, y: 0} is the center position.
     * @type {Object}
     */
    rightStick: any;
}
var contro: _Contros;
var controllers: _Contros;
function renderStats(x: number, y: number): void;
type planck = any;
namespace planck {
    type Vec2 = any;
    type Body = any;
    type Fixture = any;
    type World = any;
    type Contact = any;
}

}
