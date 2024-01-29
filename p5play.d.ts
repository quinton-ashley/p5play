import * as p5 from 'p5';
declare global {

        sprites: {
            [x: number]: any;
        };
        /**
         * Contains all the groups in the sketch,
         *
         * The keys are the group's unique ids.
         * @type {Object.<number, Group>}
         */
        groups: {
            [x: number]: any;
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
    };
};
var p5play: {
    new (): {
        /**
         * Contains all the sprites in the sketch,
         * but users should use the `allSprites` group.
         *
         * The keys are the sprite's unique ids.
         * @type {Object.<number, Sprite>}
         */
        sprites: {
            [x: number]: any;
        };
        /**
         * Contains all the groups in the sketch,
         *
         * The keys are the group's unique ids.
         * @type {Object.<number, Group>}
         */
        groups: {
            [x: number]: any;
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
    };
};
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
var Sprite: any;
var Turtle: any;
var SpriteAnimation: {
    new (...args: p5.Image[]): {
        [n: number]: p5.Image;
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
        frame: number;
        /**
         * Delay between frames in number of draw cycles.
         * If set to 4 the framerate of the animation would be the
         * sketch framerate divided by 4 (60fps = 15fps)
         * @type {Number}
         * @default 4
         */
        frameDelay: number;
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
        scale: any;
        /**
         * Make a copy of the animation.
         *
         * @return {SpriteAnimation} A copy of the animation.
         */
        clone(): any;
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
        readonly lastFrame: number;
        /**
         * The current frame as p5.Image. Read only.
         * @type {p5.Image}
         */
        readonly frameImage: p5.Image;
        /**
         * Width of the animation.
         * @type {Number}
         */
        readonly w: number;
        /**
         * Width of the animation.
         * @type {Number}
         */
        readonly width: number;
        /**
         * Height of the animation.
         * @type {Number}
         */
        readonly h: number;
        /**
         * Height of the animation.
         * @type {Number}
         */
        readonly height: number;
        /**
         * Deprecated. Use the animation object itself, which is an array of frames.
         *
         * The frames of the animation. Read only.
         * @deprecated
         * @type {p5.Image[]}
         */
        readonly frames: p5.Image[];
        length: number;
        toString(): string;
        toLocaleString(): string;
        pop(): p5.Image;
        push(...items: p5.Image[]): number;
        concat(...items: ConcatArray<p5.Image>[]): p5.Image[];
        concat(...items: any[]): p5.Image[];
        join(separator?: string): string;
        reverse(): p5.Image[];
        shift(): p5.Image;
        slice(start?: number, end?: number): p5.Image[];
        sort(compareFn?: (a: p5.Image, b: p5.Image) => number): any;
        splice(start: number, deleteCount?: number): p5.Image[];
        splice(start: number, deleteCount: number, ...items: p5.Image[]): p5.Image[];
        unshift(...items: p5.Image[]): number;
        indexOf(searchElement: p5.Image, fromIndex?: number): number;
        lastIndexOf(searchElement: p5.Image, fromIndex?: number): number;
        every<S extends p5.Image>(predicate: (value: p5.Image, index: number, array: p5.Image[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: p5.Image, index: number, array: p5.Image[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: p5.Image, index: number, array: p5.Image[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: p5.Image, index: number, array: p5.Image[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: p5.Image, index: number, array: p5.Image[]) => U, thisArg?: any): U[];
        filter<S_1 extends p5.Image>(predicate: (value: p5.Image, index: number, array: p5.Image[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: p5.Image, index: number, array: p5.Image[]) => unknown, thisArg?: any): p5.Image[];
        reduce(callbackfn: (previousValue: p5.Image, currentValue: p5.Image, currentIndex: number, array: p5.Image[]) => p5.Image): p5.Image;
        reduce(callbackfn: (previousValue: p5.Image, currentValue: p5.Image, currentIndex: number, array: p5.Image[]) => p5.Image, initialValue: p5.Image): p5.Image;
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: p5.Image, currentIndex: number, array: p5.Image[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: p5.Image, currentValue: p5.Image, currentIndex: number, array: p5.Image[]) => p5.Image): p5.Image;
        reduceRight(callbackfn: (previousValue: p5.Image, currentValue: p5.Image, currentIndex: number, array: p5.Image[]) => p5.Image, initialValue: p5.Image): p5.Image;
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: p5.Image, currentIndex: number, array: p5.Image[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends p5.Image>(predicate: (value: p5.Image, index: number, obj: p5.Image[]) => value is S_2, thisArg?: any): S_2;
        find(predicate: (value: p5.Image, index: number, obj: p5.Image[]) => unknown, thisArg?: any): p5.Image;
        findIndex(predicate: (value: p5.Image, index: number, obj: p5.Image[]) => unknown, thisArg?: any): number;
        fill(value: p5.Image, start?: number, end?: number): any;
        copyWithin(target: number, start: number, end?: number): any;
        entries(): IterableIterator<[number, p5.Image]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<p5.Image>;
        includes(searchElement: p5.Image, fromIndex?: number): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: p5.Image, index: number, array: p5.Image[]) => U_3 | readonly U_3[], thisArg?: This): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
        at(index: number): p5.Image;
        findLast<S_3 extends p5.Image>(predicate: (value: p5.Image, index: number, array: p5.Image[]) => value is S_3, thisArg?: any): S_3;
        findLast(predicate: (value: p5.Image, index: number, array: p5.Image[]) => unknown, thisArg?: any): p5.Image;
        findLastIndex(predicate: (value: p5.Image, index: number, array: p5.Image[]) => unknown, thisArg?: any): number;
        toReversed(): p5.Image[];
        toSorted(compareFn?: (a: p5.Image, b: p5.Image) => number): p5.Image[];
        toSpliced(start: number, deleteCount: number, ...items: p5.Image[]): p5.Image[];
        toSpliced(start: number, deleteCount?: number): p5.Image[];
        with(index: number, value: p5.Image): p5.Image[];
        [Symbol.iterator](): IterableIterator<p5.Image>;
        readonly [Symbol.unscopables]: {
            [x: number]: boolean;
            length?: boolean;
            toString?: boolean;
            toLocaleString?: boolean;
            pop?: boolean;
            push?: boolean;
            concat?: boolean;
            join?: boolean;
            reverse?: boolean;
            shift?: boolean;
            slice?: boolean;
            sort?: boolean;
            splice?: boolean;
            unshift?: boolean;
            indexOf?: boolean;
            lastIndexOf?: boolean;
            every?: boolean;
            some?: boolean;
            forEach?: boolean;
            map?: boolean;
            filter?: boolean;
            reduce?: boolean;
            reduceRight?: boolean;
            find?: boolean;
            findIndex?: boolean;
            fill?: boolean;
            copyWithin?: boolean;
            entries?: boolean;
            keys?: boolean;
            values?: boolean;
            includes?: boolean;
            flatMap?: boolean;
            flat?: boolean;
            at?: boolean;
            findLast?: boolean;
            findLastIndex?: boolean;
            toReversed?: boolean;
            toSorted?: boolean;
            toSpliced?: boolean;
            with?: boolean;
            [Symbol.iterator]?: boolean;
            readonly [Symbol.unscopables]?: boolean;
        };
    };
    isArray(arg: any): arg is any[];
    from<T>(arrayLike: ArrayLike<T>): T[];
    from<T_1, U_4>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U_4, thisArg?: any): U_4[];
    from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
    from<T_3, U_5>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_5, thisArg?: any): U_5[];
    of<T_4>(...items: T_4[]): T_4[];
    readonly [Symbol.species]: ArrayConstructor;
};
var SpriteAnimations: {
    new (): {
        "__#1@#_": {};
    };
};
var Group: any;
var World: {
    new (): {
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
        velocityThreshold: number;
        mouseSprite: any;
        mouseSprites: any[];
        autoStep: boolean;
        /**
         * Gravity force vector that affects all dynamic physics colliders.
         * @type {Object}
         * @property {Number} x
         * @property {Number} y
         * @default { x: 0, y: 0 }
         */
        gravity: any;
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
        getSpritesAt(x: number, y: number, group?: any, cameraActiveWhenDrawn?: boolean): any[];
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
        getSpriteAt(x: number, y: number, group?: any): any;
        getMouseSprites(): any[];
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
        allowSleeping: boolean;
    };
};
var Camera: {
    new (): {
        /**
         * Use `mouse.canvasPos.x` and `mouse.canvasPos.y` instead.
         * @deprecated
         */
        mouse: {
            x: any;
            y: any;
        };
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
        /**
         * The camera's position. {x, y}
         * @type {Object}
         */
        pos: any;
        /**
         * The camera x position.
         * @type {Number}
         */
        x: number;
        /**
         * The camera y position.
         * @type {Number}
         */
        y: number;
        /**
         * The camera's position. Alias for pos.
         * @type {Object}
         */
        position: any;
        /**
         * Moves the camera to a position. Similar to `sprite.moveTo`.
         *
         * @param {Number} x
         * @param {Number} y
         * @param {Number} speed
         * @returns {Promise} resolves true when the camera reaches the target position
         */
        moveTo(x: number, y: number, speed: number): Promise<any>;
        /**
         * Camera zoom.
         *
         * A scale of 1 will be the normal size. Setting it to 2
         * will make everything appear twice as big. .5 will make
         * everything look half size.
         * @type {Number}
         * @default 1
         */
        zoom: number;
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
    };
};
var Tiles: {
    new (tiles: string, x: number, y: number, w: number, h: number): {};
};
var createTiles: any;
var Joint: {
    new (spriteA: any, spriteB: any, type?: string): {
        /**
         * The first sprite in the joint.
         * @type {Sprite}
         */
        spriteA: any;
        /**
         * The second sprite in the joint.
         * @type {Sprite}
         */
        spriteB: any;
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
        /**
         * Function that draws the joint. Can be overridden by the user.
         * @type {Function}
         * @param {Number} xA
         * @param {Number} yA
         * @param {Number} [xB]
         * @param {Number} [yB]
         */
        draw: Function;
        /**
         * Offset to the joint's anchorA position from the center of spriteA.
         *
         * Only distance and hinge joints have an offsetA.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetA: p5.Vector;
        /**
         * Offset to the joint's anchorB position from the center of spriteB.
         *
         * Only distance, hinge, and wheel joints have an offsetB.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetB: p5.Vector;
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
        springiness: number;
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
        damping: number;
        /**
         * The current speed of the joint's motor.
         * @type {Number}
         * @default 0
         */
        speed: number;
        readonly motorSpeed: any;
        /**
         * Enable or disable the joint's motor.
         * Disabling the motor is like putting a
         * car in neutral.
         * @type {Boolean}
         */
        enableMotor: boolean;
        /**
         * Max power is how the amount of torque a joint motor can exert
         * around its axis of rotation.
         * @type {Number}
         * @default 0
         */
        maxPower: number;
        /**
         * Read only.  The joint's current power, the amount of torque
         * being applied on the joint's axis of rotation.
         * @type {Number}
         * @default 0
         */
        readonly power: number;
        /**
         * Set to true if you want the joint's sprites to collide with
         * each other.
         * @type {Boolean}
         * @default false
         */
        collideConnected: boolean;
        /**
         * Removes the joint from the world and from each of the
         * sprites' joints arrays.
         */
        remove(): void;
    };
};
var GlueJoint: {
    new (spriteA: any, spriteB: any, ...args: any[]): {
        /**
         * The first sprite in the joint.
         * @type {Sprite}
         */
        spriteA: any;
        /**
         * The second sprite in the joint.
         * @type {Sprite}
         */
        spriteB: any;
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
        /**
         * Function that draws the joint. Can be overridden by the user.
         * @type {Function}
         * @param {Number} xA
         * @param {Number} yA
         * @param {Number} [xB]
         * @param {Number} [yB]
         */
        draw: Function;
        /**
         * Offset to the joint's anchorA position from the center of spriteA.
         *
         * Only distance and hinge joints have an offsetA.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetA: p5.Vector;
        /**
         * Offset to the joint's anchorB position from the center of spriteB.
         *
         * Only distance, hinge, and wheel joints have an offsetB.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetB: p5.Vector;
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
        springiness: number;
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
        damping: number;
        /**
         * The current speed of the joint's motor.
         * @type {Number}
         * @default 0
         */
        speed: number;
        readonly motorSpeed: any;
        /**
         * Enable or disable the joint's motor.
         * Disabling the motor is like putting a
         * car in neutral.
         * @type {Boolean}
         */
        enableMotor: boolean;
        /**
         * Max power is how the amount of torque a joint motor can exert
         * around its axis of rotation.
         * @type {Number}
         * @default 0
         */
        maxPower: number;
        /**
         * Read only.  The joint's current power, the amount of torque
         * being applied on the joint's axis of rotation.
         * @type {Number}
         * @default 0
         */
        readonly power: number;
        /**
         * Set to true if you want the joint's sprites to collide with
         * each other.
         * @type {Boolean}
         * @default false
         */
        collideConnected: boolean;
        /**
         * Removes the joint from the world and from each of the
         * sprites' joints arrays.
         */
        remove(): void;
    };
};
var DistanceJoint: {
    new (spriteA: any, spriteB: any, ...args: any[]): {
        /**
         * Determines whether to draw the joint if spriteA
         * or spriteB is drawn.
         * @type {Boolean}
         * @default true
         */
        visible: boolean;
        /**
         * The first sprite in the joint.
         * @type {Sprite}
         */
        spriteA: any;
        /**
         * The second sprite in the joint.
         * @type {Sprite}
         */
        spriteB: any;
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
         * Function that draws the joint. Can be overridden by the user.
         * @type {Function}
         * @param {Number} xA
         * @param {Number} yA
         * @param {Number} [xB]
         * @param {Number} [yB]
         */
        draw: Function;
        /**
         * Offset to the joint's anchorA position from the center of spriteA.
         *
         * Only distance and hinge joints have an offsetA.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetA: p5.Vector;
        /**
         * Offset to the joint's anchorB position from the center of spriteB.
         *
         * Only distance, hinge, and wheel joints have an offsetB.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetB: p5.Vector;
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
        springiness: number;
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
        damping: number;
        /**
         * The current speed of the joint's motor.
         * @type {Number}
         * @default 0
         */
        speed: number;
        readonly motorSpeed: any;
        /**
         * Enable or disable the joint's motor.
         * Disabling the motor is like putting a
         * car in neutral.
         * @type {Boolean}
         */
        enableMotor: boolean;
        /**
         * Max power is how the amount of torque a joint motor can exert
         * around its axis of rotation.
         * @type {Number}
         * @default 0
         */
        maxPower: number;
        /**
         * Read only.  The joint's current power, the amount of torque
         * being applied on the joint's axis of rotation.
         * @type {Number}
         * @default 0
         */
        readonly power: number;
        /**
         * Set to true if you want the joint's sprites to collide with
         * each other.
         * @type {Boolean}
         * @default false
         */
        collideConnected: boolean;
        /**
         * Removes the joint from the world and from each of the
         * sprites' joints arrays.
         */
        remove(): void;
    };
};
var WheelJoint: {
    new (spriteA: any, spriteB: any, ...args: any[]): {
        /**
         * Determines whether to draw the joint if spriteA
         * or spriteB is drawn.
         * @type {Boolean}
         * @default true
         */
        visible: boolean;
        /**
         * The angle at which the wheel is attached to the vehicle body.
         *
         * The default is 90 degrees or PI/2 radians, which is vertical.
         * @type {Number}
         * @default 90
         */
        angle: number;
        /**
         * The first sprite in the joint.
         * @type {Sprite}
         */
        spriteA: any;
        /**
         * The second sprite in the joint.
         * @type {Sprite}
         */
        spriteB: any;
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
         * Function that draws the joint. Can be overridden by the user.
         * @type {Function}
         * @param {Number} xA
         * @param {Number} yA
         * @param {Number} [xB]
         * @param {Number} [yB]
         */
        draw: Function;
        /**
         * Offset to the joint's anchorA position from the center of spriteA.
         *
         * Only distance and hinge joints have an offsetA.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetA: p5.Vector;
        /**
         * Offset to the joint's anchorB position from the center of spriteB.
         *
         * Only distance, hinge, and wheel joints have an offsetB.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetB: p5.Vector;
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
        springiness: number;
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
        damping: number;
        /**
         * The current speed of the joint's motor.
         * @type {Number}
         * @default 0
         */
        speed: number;
        readonly motorSpeed: any;
        /**
         * Enable or disable the joint's motor.
         * Disabling the motor is like putting a
         * car in neutral.
         * @type {Boolean}
         */
        enableMotor: boolean;
        /**
         * Max power is how the amount of torque a joint motor can exert
         * around its axis of rotation.
         * @type {Number}
         * @default 0
         */
        maxPower: number;
        /**
         * Read only.  The joint's current power, the amount of torque
         * being applied on the joint's axis of rotation.
         * @type {Number}
         * @default 0
         */
        readonly power: number;
        /**
         * Set to true if you want the joint's sprites to collide with
         * each other.
         * @type {Boolean}
         * @default false
         */
        collideConnected: boolean;
        /**
         * Removes the joint from the world and from each of the
         * sprites' joints arrays.
         */
        remove(): void;
    };
};
var HingeJoint: {
    new (spriteA: any, spriteB: any, ...args: any[]): {
        /**
         * Determines whether to draw the joint if spriteA
         * or spriteB is drawn.
         * @type {Boolean}
         * @default true
         */
        visible: boolean;
        /**
         * The joint's range of rotation. Setting the range
         * changes the joint's upper and lower limits.
         * @type {Number}
         * @default undefined
         */
        range: number;
        /**
         * The upper limit of rotation.
         * @type {Number}
         * @default undefined
         */
        upperLimit: number;
        /**
         * The lower limit of rotation.
         * @type {Number}
         * @default undefined
         */
        lowerLimit: number;
        /**
         * Read only. The joint's current angle of rotation.
         * @type {Number}
         * @default 0
         */
        readonly angle: number;
        /**
         * The first sprite in the joint.
         * @type {Sprite}
         */
        spriteA: any;
        /**
         * The second sprite in the joint.
         * @type {Sprite}
         */
        spriteB: any;
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
         * Function that draws the joint. Can be overridden by the user.
         * @type {Function}
         * @param {Number} xA
         * @param {Number} yA
         * @param {Number} [xB]
         * @param {Number} [yB]
         */
        draw: Function;
        /**
         * Offset to the joint's anchorA position from the center of spriteA.
         *
         * Only distance and hinge joints have an offsetA.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetA: p5.Vector;
        /**
         * Offset to the joint's anchorB position from the center of spriteB.
         *
         * Only distance, hinge, and wheel joints have an offsetB.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetB: p5.Vector;
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
        springiness: number;
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
        damping: number;
        /**
         * The current speed of the joint's motor.
         * @type {Number}
         * @default 0
         */
        speed: number;
        readonly motorSpeed: any;
        /**
         * Enable or disable the joint's motor.
         * Disabling the motor is like putting a
         * car in neutral.
         * @type {Boolean}
         */
        enableMotor: boolean;
        /**
         * Max power is how the amount of torque a joint motor can exert
         * around its axis of rotation.
         * @type {Number}
         * @default 0
         */
        maxPower: number;
        /**
         * Read only.  The joint's current power, the amount of torque
         * being applied on the joint's axis of rotation.
         * @type {Number}
         * @default 0
         */
        readonly power: number;
        /**
         * Set to true if you want the joint's sprites to collide with
         * each other.
         * @type {Boolean}
         * @default false
         */
        collideConnected: boolean;
        /**
         * Removes the joint from the world and from each of the
         * sprites' joints arrays.
         */
        remove(): void;
    };
};
var RevoluteJoint: {
    new (spriteA: any, spriteB: any, ...args: any[]): {
        /**
         * Determines whether to draw the joint if spriteA
         * or spriteB is drawn.
         * @type {Boolean}
         * @default true
         */
        visible: boolean;
        /**
         * The joint's range of rotation. Setting the range
         * changes the joint's upper and lower limits.
         * @type {Number}
         * @default undefined
         */
        range: number;
        /**
         * The upper limit of rotation.
         * @type {Number}
         * @default undefined
         */
        upperLimit: number;
        /**
         * The lower limit of rotation.
         * @type {Number}
         * @default undefined
         */
        lowerLimit: number;
        /**
         * Read only. The joint's current angle of rotation.
         * @type {Number}
         * @default 0
         */
        readonly angle: number;
        /**
         * The first sprite in the joint.
         * @type {Sprite}
         */
        spriteA: any;
        /**
         * The second sprite in the joint.
         * @type {Sprite}
         */
        spriteB: any;
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
         * Function that draws the joint. Can be overridden by the user.
         * @type {Function}
         * @param {Number} xA
         * @param {Number} yA
         * @param {Number} [xB]
         * @param {Number} [yB]
         */
        draw: Function;
        /**
         * Offset to the joint's anchorA position from the center of spriteA.
         *
         * Only distance and hinge joints have an offsetA.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetA: p5.Vector;
        /**
         * Offset to the joint's anchorB position from the center of spriteB.
         *
         * Only distance, hinge, and wheel joints have an offsetB.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetB: p5.Vector;
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
        springiness: number;
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
        damping: number;
        /**
         * The current speed of the joint's motor.
         * @type {Number}
         * @default 0
         */
        speed: number;
        readonly motorSpeed: any;
        /**
         * Enable or disable the joint's motor.
         * Disabling the motor is like putting a
         * car in neutral.
         * @type {Boolean}
         */
        enableMotor: boolean;
        /**
         * Max power is how the amount of torque a joint motor can exert
         * around its axis of rotation.
         * @type {Number}
         * @default 0
         */
        maxPower: number;
        /**
         * Read only.  The joint's current power, the amount of torque
         * being applied on the joint's axis of rotation.
         * @type {Number}
         * @default 0
         */
        readonly power: number;
        /**
         * Set to true if you want the joint's sprites to collide with
         * each other.
         * @type {Boolean}
         * @default false
         */
        collideConnected: boolean;
        /**
         * Removes the joint from the world and from each of the
         * sprites' joints arrays.
         */
        remove(): void;
    };
};
var SliderJoint: {
    new (spriteA: any, spriteB: any, ...args: any[]): {
        /**
         * The angle of the joint's axis which its sprites slide along.
         * @type {Number}
         * @default 0
         */
        angle: number;
        /**
         * The joint's range of translation. Setting the range
         * changes the joint's upper and lower limits.
         * @type {Number}
         * @default undefined
         */
        range: number;
        /**
         * The mathematical upper (not positionally higher)
         * limit of translation.
         * @type {Number}
         * @default undefined
         */
        upperLimit: number;
        /**
         * The mathematical lower (not positionally lower)
         * limit of translation.
         * @type {Number}
         * @default undefined
         */
        lowerLimit: number;
        /**
         * The first sprite in the joint.
         * @type {Sprite}
         */
        spriteA: any;
        /**
         * The second sprite in the joint.
         * @type {Sprite}
         */
        spriteB: any;
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
        /**
         * Function that draws the joint. Can be overridden by the user.
         * @type {Function}
         * @param {Number} xA
         * @param {Number} yA
         * @param {Number} [xB]
         * @param {Number} [yB]
         */
        draw: Function;
        /**
         * Offset to the joint's anchorA position from the center of spriteA.
         *
         * Only distance and hinge joints have an offsetA.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetA: p5.Vector;
        /**
         * Offset to the joint's anchorB position from the center of spriteB.
         *
         * Only distance, hinge, and wheel joints have an offsetB.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetB: p5.Vector;
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
        springiness: number;
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
        damping: number;
        /**
         * The current speed of the joint's motor.
         * @type {Number}
         * @default 0
         */
        speed: number;
        readonly motorSpeed: any;
        /**
         * Enable or disable the joint's motor.
         * Disabling the motor is like putting a
         * car in neutral.
         * @type {Boolean}
         */
        enableMotor: boolean;
        /**
         * Max power is how the amount of torque a joint motor can exert
         * around its axis of rotation.
         * @type {Number}
         * @default 0
         */
        maxPower: number;
        /**
         * Read only.  The joint's current power, the amount of torque
         * being applied on the joint's axis of rotation.
         * @type {Number}
         * @default 0
         */
        readonly power: number;
        /**
         * Set to true if you want the joint's sprites to collide with
         * each other.
         * @type {Boolean}
         * @default false
         */
        collideConnected: boolean;
        /**
         * Removes the joint from the world and from each of the
         * sprites' joints arrays.
         */
        remove(): void;
    };
};
var PrismaticJoint: {
    new (spriteA: any, spriteB: any, ...args: any[]): {
        /**
         * The angle of the joint's axis which its sprites slide along.
         * @type {Number}
         * @default 0
         */
        angle: number;
        /**
         * The joint's range of translation. Setting the range
         * changes the joint's upper and lower limits.
         * @type {Number}
         * @default undefined
         */
        range: number;
        /**
         * The mathematical upper (not positionally higher)
         * limit of translation.
         * @type {Number}
         * @default undefined
         */
        upperLimit: number;
        /**
         * The mathematical lower (not positionally lower)
         * limit of translation.
         * @type {Number}
         * @default undefined
         */
        lowerLimit: number;
        /**
         * The first sprite in the joint.
         * @type {Sprite}
         */
        spriteA: any;
        /**
         * The second sprite in the joint.
         * @type {Sprite}
         */
        spriteB: any;
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
        /**
         * Function that draws the joint. Can be overridden by the user.
         * @type {Function}
         * @param {Number} xA
         * @param {Number} yA
         * @param {Number} [xB]
         * @param {Number} [yB]
         */
        draw: Function;
        /**
         * Offset to the joint's anchorA position from the center of spriteA.
         *
         * Only distance and hinge joints have an offsetA.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetA: p5.Vector;
        /**
         * Offset to the joint's anchorB position from the center of spriteB.
         *
         * Only distance, hinge, and wheel joints have an offsetB.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetB: p5.Vector;
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
        springiness: number;
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
        damping: number;
        /**
         * The current speed of the joint's motor.
         * @type {Number}
         * @default 0
         */
        speed: number;
        readonly motorSpeed: any;
        /**
         * Enable or disable the joint's motor.
         * Disabling the motor is like putting a
         * car in neutral.
         * @type {Boolean}
         */
        enableMotor: boolean;
        /**
         * Max power is how the amount of torque a joint motor can exert
         * around its axis of rotation.
         * @type {Number}
         * @default 0
         */
        maxPower: number;
        /**
         * Read only.  The joint's current power, the amount of torque
         * being applied on the joint's axis of rotation.
         * @type {Number}
         * @default 0
         */
        readonly power: number;
        /**
         * Set to true if you want the joint's sprites to collide with
         * each other.
         * @type {Boolean}
         * @default false
         */
        collideConnected: boolean;
        /**
         * Removes the joint from the world and from each of the
         * sprites' joints arrays.
         */
        remove(): void;
    };
};
var RopeJoint: {
    new (spriteA: any, spriteB: any, ...args: any[]): {
        /**
         * The maximum length of the rope.
         */
        maxLength: number;
        /**
         * The first sprite in the joint.
         * @type {Sprite}
         */
        spriteA: any;
        /**
         * The second sprite in the joint.
         * @type {Sprite}
         */
        spriteB: any;
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
        /**
         * Function that draws the joint. Can be overridden by the user.
         * @type {Function}
         * @param {Number} xA
         * @param {Number} yA
         * @param {Number} [xB]
         * @param {Number} [yB]
         */
        draw: Function;
        /**
         * Offset to the joint's anchorA position from the center of spriteA.
         *
         * Only distance and hinge joints have an offsetA.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetA: p5.Vector;
        /**
         * Offset to the joint's anchorB position from the center of spriteB.
         *
         * Only distance, hinge, and wheel joints have an offsetB.
         * @type {p5.Vector}
         * @default {x: 0, y: 0}
         */
        offsetB: p5.Vector;
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
        springiness: number;
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
        damping: number;
        /**
         * The current speed of the joint's motor.
         * @type {Number}
         * @default 0
         */
        speed: number;
        readonly motorSpeed: any;
        /**
         * Enable or disable the joint's motor.
         * Disabling the motor is like putting a
         * car in neutral.
         * @type {Boolean}
         */
        enableMotor: boolean;
        /**
         * Max power is how the amount of torque a joint motor can exert
         * around its axis of rotation.
         * @type {Number}
         * @default 0
         */
        maxPower: number;
        /**
         * Read only.  The joint's current power, the amount of torque
         * being applied on the joint's axis of rotation.
         * @type {Number}
         * @default 0
         */
        readonly power: number;
        /**
         * Set to true if you want the joint's sprites to collide with
         * each other.
         * @type {Boolean}
         * @default false
         */
        collideConnected: boolean;
        /**
         * Removes the joint from the world and from each of the
         * sprites' joints arrays.
         */
        remove(): void;
    };
};
class Scale {
    valueOf(): any;
}
function encodeFloat16(v: any): number;
var colorPal: any;
var spriteArt: any;
var createSprite: any;
var createGroup: any;
function loadAnimation(...args: any[]): {
    new (...args: p5.Image[]): {
        [n: number]: p5.Image;
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
        frame: number;
        /**
         * Delay between frames in number of draw cycles.
         * If set to 4 the framerate of the animation would be the
         * sketch framerate divided by 4 (60fps = 15fps)
         * @type {Number}
         * @default 4
         */
        frameDelay: number;
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
        scale: any;
        /**
         * Make a copy of the animation.
         *
         * @return {SpriteAnimation} A copy of the animation.
         */
        clone(): any;
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
        readonly lastFrame: number;
        /**
         * The current frame as p5.Image. Read only.
         * @type {p5.Image}
         */
        readonly frameImage: p5.Image;
        /**
         * Width of the animation.
         * @type {Number}
         */
        readonly w: number;
        /**
         * Width of the animation.
         * @type {Number}
         */
        readonly width: number;
        /**
         * Height of the animation.
         * @type {Number}
         */
        readonly h: number;
        /**
         * Height of the animation.
         * @type {Number}
         */
        readonly height: number;
        /**
         * Deprecated. Use the animation object itself, which is an array of frames.
         *
         * The frames of the animation. Read only.
         * @deprecated
         * @type {p5.Image[]}
         */
        readonly frames: p5.Image[];
        length: number;
        toString(): string;
        toLocaleString(): string;
        pop(): p5.Image;
        push(...items: p5.Image[]): number;
        concat(...items: ConcatArray<p5.Image>[]): p5.Image[];
        concat(...items: any[]): p5.Image[];
        join(separator?: string): string;
        reverse(): p5.Image[];
        shift(): p5.Image;
        slice(start?: number, end?: number): p5.Image[];
        sort(compareFn?: (a: p5.Image, b: p5.Image) => number): any;
        splice(start: number, deleteCount?: number): p5.Image[];
        splice(start: number, deleteCount: number, ...items: p5.Image[]): p5.Image[];
        unshift(...items: p5.Image[]): number;
        indexOf(searchElement: p5.Image, fromIndex?: number): number;
        lastIndexOf(searchElement: p5.Image, fromIndex?: number): number;
        every<S extends p5.Image>(predicate: (value: p5.Image, index: number, array: p5.Image[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: p5.Image, index: number, array: p5.Image[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: p5.Image, index: number, array: p5.Image[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: p5.Image, index: number, array: p5.Image[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: p5.Image, index: number, array: p5.Image[]) => U, thisArg?: any): U[];
        filter<S_1 extends p5.Image>(predicate: (value: p5.Image, index: number, array: p5.Image[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: p5.Image, index: number, array: p5.Image[]) => unknown, thisArg?: any): p5.Image[];
        reduce(callbackfn: (previousValue: p5.Image, currentValue: p5.Image, currentIndex: number, array: p5.Image[]) => p5.Image): p5.Image;
        reduce(callbackfn: (previousValue: p5.Image, currentValue: p5.Image, currentIndex: number, array: p5.Image[]) => p5.Image, initialValue: p5.Image): p5.Image;
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: p5.Image, currentIndex: number, array: p5.Image[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: p5.Image, currentValue: p5.Image, currentIndex: number, array: p5.Image[]) => p5.Image): p5.Image;
        reduceRight(callbackfn: (previousValue: p5.Image, currentValue: p5.Image, currentIndex: number, array: p5.Image[]) => p5.Image, initialValue: p5.Image): p5.Image;
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: p5.Image, currentIndex: number, array: p5.Image[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends p5.Image>(predicate: (value: p5.Image, index: number, obj: p5.Image[]) => value is S_2, thisArg?: any): S_2;
        find(predicate: (value: p5.Image, index: number, obj: p5.Image[]) => unknown, thisArg?: any): p5.Image;
        findIndex(predicate: (value: p5.Image, index: number, obj: p5.Image[]) => unknown, thisArg?: any): number;
        fill(value: p5.Image, start?: number, end?: number): any;
        copyWithin(target: number, start: number, end?: number): any;
        entries(): IterableIterator<[number, p5.Image]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<p5.Image>;
        includes(searchElement: p5.Image, fromIndex?: number): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: p5.Image, index: number, array: p5.Image[]) => U_3 | readonly U_3[], thisArg?: This): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
        at(index: number): p5.Image;
        findLast<S_3 extends p5.Image>(predicate: (value: p5.Image, index: number, array: p5.Image[]) => value is S_3, thisArg?: any): S_3;
        findLast(predicate: (value: p5.Image, index: number, array: p5.Image[]) => unknown, thisArg?: any): p5.Image;
        findLastIndex(predicate: (value: p5.Image, index: number, array: p5.Image[]) => unknown, thisArg?: any): number;
        toReversed(): p5.Image[];
        toSorted(compareFn?: (a: p5.Image, b: p5.Image) => number): p5.Image[];
        toSpliced(start: number, deleteCount: number, ...items: p5.Image[]): p5.Image[];
        toSpliced(start: number, deleteCount?: number): p5.Image[];
        with(index: number, value: p5.Image): p5.Image[];
        [Symbol.iterator](): IterableIterator<p5.Image>;
        readonly [Symbol.unscopables]: {
            [x: number]: boolean;
            length?: boolean;
            toString?: boolean;
            toLocaleString?: boolean;
            pop?: boolean;
            push?: boolean;
            concat?: boolean;
            join?: boolean;
            reverse?: boolean;
            shift?: boolean;
            slice?: boolean;
            sort?: boolean;
            splice?: boolean;
            unshift?: boolean;
            indexOf?: boolean;
            lastIndexOf?: boolean;
            every?: boolean;
            some?: boolean;
            forEach?: boolean;
            map?: boolean;
            filter?: boolean;
            reduce?: boolean;
            reduceRight?: boolean;
            find?: boolean;
            findIndex?: boolean;
            fill?: boolean;
            copyWithin?: boolean;
            entries?: boolean;
            keys?: boolean;
            values?: boolean;
            includes?: boolean;
            flatMap?: boolean;
            flat?: boolean;
            at?: boolean;
            findLast?: boolean;
            findLastIndex?: boolean;
            toReversed?: boolean;
            toSorted?: boolean;
            toSpliced?: boolean;
            with?: boolean;
            [Symbol.iterator]?: boolean;
            readonly [Symbol.unscopables]?: boolean;
        };
    };
    isArray(arg: any): arg is any[];
    from<T>(arrayLike: ArrayLike<T>): T[];
    from<T_1, U_4>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U_4, thisArg?: any): U_4[];
    from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
    from<T_3, U_5>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_5, thisArg?: any): U_5[];
    of<T_4>(...items: T_4[]): T_4[];
    readonly [Symbol.species]: ArrayConstructor;
};
var loadAni: any;
var animation: any;
var delay: any;
var sleep: any;
var play: any;
let userDisabledP5Errors: boolean;
var createCanvas: any;
var Canvas: any;
var resizeCanvas: any;
var background: any;
var fill: any;
var stroke: any;
function loadImage(...args: any[]): any;
var loadImg: any;
var image: any;
let enableTextCache: boolean;
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
var allSprites: any;
var world: {
    new (): {
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
        velocityThreshold: number;
        mouseSprite: any;
        mouseSprites: any[];
        autoStep: boolean;
        /**
         * Gravity force vector that affects all dynamic physics colliders.
         * @type {Object}
         * @property {Number} x
         * @property {Number} y
         * @default { x: 0, y: 0 }
         */
        gravity: any;
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
        getSpritesAt(x: number, y: number, group?: any, cameraActiveWhenDrawn?: boolean): any[];
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
        getSpriteAt(x: number, y: number, group?: any): any;
        getMouseSprites(): any[];
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
        allowSleeping: boolean;
    };
};
var camera: {
    new (): {
        /**
         * Use `mouse.canvasPos.x` and `mouse.canvasPos.y` instead.
         * @deprecated
         */
        mouse: {
            x: any;
            y: any;
        };
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
        /**
         * The camera's position. {x, y}
         * @type {Object}
         */
        pos: any;
        /**
         * The camera x position.
         * @type {Number}
         */
        x: number;
        /**
         * The camera y position.
         * @type {Number}
         */
        y: number;
        /**
         * The camera's position. Alias for pos.
         * @type {Object}
         */
        position: any;
        /**
         * Moves the camera to a position. Similar to `sprite.moveTo`.
         *
         * @param {Number} x
         * @param {Number} y
         * @param {Number} speed
         * @returns {Promise} resolves true when the camera reaches the target position
         */
        moveTo(x: number, y: number, speed: number): Promise<any>;
        /**
         * Camera zoom.
         *
         * A scale of 1 will be the normal size. Setting it to 2
         * will make everything appear twice as big. .5 will make
         * everything look half size.
         * @type {Number}
         * @default 1
         */
        zoom: number;
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
    };
};
var InputDevice: {
    new (): {
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
    };
};
var _Mouse: {
    new (): {
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
        readonly pos: any;
        /**
         * The mouse's position. Alias for pos.
         * @type {object}
         */
        readonly position: any;
        /**
         * The mouse's CSS cursor style.
         * @type {string}
         * @default 'default'
         */
        cursor: string;
        /**
         * Controls whether the mouse is visible or not.
         * @type {boolean}
         * @default true
         */
        visible: boolean;
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
    };
};
var mouse: {
    new (): {
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
        readonly pos: any;
        /**
         * The mouse's position. Alias for pos.
         * @type {object}
         */
        readonly position: any;
        /**
         * The mouse's CSS cursor style.
         * @type {string}
         * @default 'default'
         */
        cursor: string;
        /**
         * Controls whether the mouse is visible or not.
         * @type {boolean}
         * @default true
         */
        visible: boolean;
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
    };
};
var _SpriteMouse: {
    new (): {
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
        readonly pos: any;
        /**
         * The mouse's position. Alias for pos.
         * @type {object}
         */
        readonly position: any;
        /**
         * The mouse's CSS cursor style.
         * @type {string}
         * @default 'default'
         */
        cursor: string;
        /**
         * Controls whether the mouse is visible or not.
         * @type {boolean}
         * @default true
         */
        visible: boolean;
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
    };
};
var _Touch: {
    new (touch: any): {
        id: any;
        holdThreshold: any;
        duration: number;
        drag: number;
        /**
         * The touch's absolute position on the canvas.
         * @type {object}
         * @property {Number} x
         * @property {Number} y
         */
        canvasPos: object;
        x: any;
        y: any;
        force: any;
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
    };
};
var _Keyboard: {
    new (): {
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
        visible: boolean;
        readonly cmd: number;
        readonly command: number;
        readonly ctrl: number;
        readonly space: any;
        readonly spacebar: any;
        readonly opt: number;
        readonly option: number;
        readonly win: number;
        readonly windows: number;
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
    };
};
var kb: {
    new (): {
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
        visible: boolean;
        readonly cmd: number;
        readonly command: number;
        readonly ctrl: number;
        readonly space: any;
        readonly spacebar: any;
        readonly opt: number;
        readonly option: number;
        readonly win: number;
        readonly windows: number;
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
    };
};
var keyboard: {
    new (): {
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
        visible: boolean;
        readonly cmd: number;
        readonly command: number;
        readonly ctrl: number;
        readonly space: any;
        readonly spacebar: any;
        readonly opt: number;
        readonly option: number;
        readonly win: number;
        readonly windows: number;
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
    };
};
var _Contro: {
    new (gp: any): {
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
        readonly ls: {
            x: number;
            y: number;
        };
        readonly rs: {
            x: number;
            y: number;
        };
        readonly lb: any;
        readonly rb: any;
        readonly leftStickButton: any;
        readonly rightStickButton: any;
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
    };
};
var _Contros: {
    new (): {
        [n: number]: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
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
        length: number;
        toString(): string;
        toLocaleString(): string;
        pop(): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        push(...items: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]): number;
        concat(...items: ConcatArray<{
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>[]): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        concat(...items: ({
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        } | ConcatArray<{
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>)[]): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        join(separator?: string): string;
        reverse(): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        shift(): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        slice(start?: number, end?: number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        sort(compareFn?: (a: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, b: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }) => number): any;
        splice(start: number, deleteCount?: number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        splice(start: number, deleteCount: number, ...items: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        unshift(...items: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]): number;
        indexOf(searchElement: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, fromIndex?: number): number;
        lastIndexOf(searchElement: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, fromIndex?: number): number;
        every<S extends {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => U, thisArg?: any): U[];
        filter<S_1 extends {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        reduce(callbackfn: (previousValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        reduce(callbackfn: (previousValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, initialValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        reduceRight(callbackfn: (previousValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, initialValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, obj: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => value is S_2, thisArg?: any): S_2;
        find(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, obj: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        findIndex(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, obj: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): number;
        fill(value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, start?: number, end?: number): any;
        copyWithin(target: number, start: number, end?: number): any;
        entries(): IterableIterator<[number, {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<{
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>;
        includes(searchElement: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, fromIndex?: number): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => U_3 | readonly U_3[], thisArg?: This): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
        at(index: number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        findLast<S_3 extends {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => value is S_3, thisArg?: any): S_3;
        findLast(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        findLastIndex(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): number;
        toReversed(): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        toSorted(compareFn?: (a: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, b: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }) => number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        toSpliced(start: number, deleteCount: number, ...items: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        toSpliced(start: number, deleteCount?: number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        with(index: number, value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        [Symbol.iterator](): IterableIterator<{
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>;
        readonly [Symbol.unscopables]: {
            [x: number]: boolean;
            length?: boolean;
            toString?: boolean;
            toLocaleString?: boolean;
            pop?: boolean;
            push?: boolean;
            concat?: boolean;
            join?: boolean;
            reverse?: boolean;
            shift?: boolean;
            slice?: boolean;
            sort?: boolean;
            splice?: boolean;
            unshift?: boolean;
            indexOf?: boolean;
            lastIndexOf?: boolean;
            every?: boolean;
            some?: boolean;
            forEach?: boolean;
            map?: boolean;
            filter?: boolean;
            reduce?: boolean;
            reduceRight?: boolean;
            find?: boolean;
            findIndex?: boolean;
            fill?: boolean;
            copyWithin?: boolean;
            entries?: boolean;
            keys?: boolean;
            values?: boolean;
            includes?: boolean;
            flatMap?: boolean;
            flat?: boolean;
            at?: boolean;
            findLast?: boolean;
            findLastIndex?: boolean;
            toReversed?: boolean;
            toSorted?: boolean;
            toSpliced?: boolean;
            with?: boolean;
            [Symbol.iterator]?: boolean;
            readonly [Symbol.unscopables]?: boolean;
        };
    };
    isArray(arg: any): arg is any[];
    from<T>(arrayLike: ArrayLike<T>): T[];
    from<T_1, U_4>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U_4, thisArg?: any): U_4[];
    from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
    from<T_3, U_5>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_5, thisArg?: any): U_5[];
    of<T_4>(...items: T_4[]): T_4[];
    readonly [Symbol.species]: ArrayConstructor;
};
var contro: {
    new (): {
        [n: number]: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
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
        length: number;
        toString(): string;
        toLocaleString(): string;
        pop(): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        push(...items: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]): number;
        concat(...items: ConcatArray<{
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>[]): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        concat(...items: ({
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        } | ConcatArray<{
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>)[]): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        join(separator?: string): string;
        reverse(): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        shift(): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        slice(start?: number, end?: number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        sort(compareFn?: (a: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, b: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }) => number): any;
        splice(start: number, deleteCount?: number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        splice(start: number, deleteCount: number, ...items: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        unshift(...items: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]): number;
        indexOf(searchElement: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, fromIndex?: number): number;
        lastIndexOf(searchElement: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, fromIndex?: number): number;
        every<S extends {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => U, thisArg?: any): U[];
        filter<S_1 extends {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        reduce(callbackfn: (previousValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        reduce(callbackfn: (previousValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, initialValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        reduceRight(callbackfn: (previousValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, initialValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, obj: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => value is S_2, thisArg?: any): S_2;
        find(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, obj: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        findIndex(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, obj: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): number;
        fill(value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, start?: number, end?: number): any;
        copyWithin(target: number, start: number, end?: number): any;
        entries(): IterableIterator<[number, {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<{
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>;
        includes(searchElement: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, fromIndex?: number): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => U_3 | readonly U_3[], thisArg?: This): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
        at(index: number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        findLast<S_3 extends {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => value is S_3, thisArg?: any): S_3;
        findLast(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        findLastIndex(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): number;
        toReversed(): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        toSorted(compareFn?: (a: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, b: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }) => number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        toSpliced(start: number, deleteCount: number, ...items: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        toSpliced(start: number, deleteCount?: number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        with(index: number, value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        [Symbol.iterator](): IterableIterator<{
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>;
        readonly [Symbol.unscopables]: {
            [x: number]: boolean;
            length?: boolean;
            toString?: boolean;
            toLocaleString?: boolean;
            pop?: boolean;
            push?: boolean;
            concat?: boolean;
            join?: boolean;
            reverse?: boolean;
            shift?: boolean;
            slice?: boolean;
            sort?: boolean;
            splice?: boolean;
            unshift?: boolean;
            indexOf?: boolean;
            lastIndexOf?: boolean;
            every?: boolean;
            some?: boolean;
            forEach?: boolean;
            map?: boolean;
            filter?: boolean;
            reduce?: boolean;
            reduceRight?: boolean;
            find?: boolean;
            findIndex?: boolean;
            fill?: boolean;
            copyWithin?: boolean;
            entries?: boolean;
            keys?: boolean;
            values?: boolean;
            includes?: boolean;
            flatMap?: boolean;
            flat?: boolean;
            at?: boolean;
            findLast?: boolean;
            findLastIndex?: boolean;
            toReversed?: boolean;
            toSorted?: boolean;
            toSpliced?: boolean;
            with?: boolean;
            [Symbol.iterator]?: boolean;
            readonly [Symbol.unscopables]?: boolean;
        };
    };
    isArray(arg: any): arg is any[];
    from<T>(arrayLike: ArrayLike<T>): T[];
    from<T_1, U_4>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U_4, thisArg?: any): U_4[];
    from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
    from<T_3, U_5>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_5, thisArg?: any): U_5[];
    of<T_4>(...items: T_4[]): T_4[];
    readonly [Symbol.species]: ArrayConstructor;
};
var controllers: {
    new (): {
        [n: number]: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
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
        length: number;
        toString(): string;
        toLocaleString(): string;
        pop(): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        push(...items: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]): number;
        concat(...items: ConcatArray<{
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>[]): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        concat(...items: ({
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        } | ConcatArray<{
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>)[]): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        join(separator?: string): string;
        reverse(): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        shift(): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        slice(start?: number, end?: number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        sort(compareFn?: (a: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, b: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }) => number): any;
        splice(start: number, deleteCount?: number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        splice(start: number, deleteCount: number, ...items: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        unshift(...items: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]): number;
        indexOf(searchElement: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, fromIndex?: number): number;
        lastIndexOf(searchElement: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, fromIndex?: number): number;
        every<S extends {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => U, thisArg?: any): U[];
        filter<S_1 extends {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        reduce(callbackfn: (previousValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        reduce(callbackfn: (previousValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, initialValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        reduceRight(callbackfn: (previousValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, initialValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, currentIndex: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, obj: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => value is S_2, thisArg?: any): S_2;
        find(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, obj: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        findIndex(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, obj: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): number;
        fill(value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, start?: number, end?: number): any;
        copyWithin(target: number, start: number, end?: number): any;
        entries(): IterableIterator<[number, {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<{
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>;
        includes(searchElement: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, fromIndex?: number): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => U_3 | readonly U_3[], thisArg?: This): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
        at(index: number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        findLast<S_3 extends {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => value is S_3, thisArg?: any): S_3;
        findLast(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        };
        findLastIndex(predicate: (value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, index: number, array: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]) => unknown, thisArg?: any): number;
        toReversed(): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        toSorted(compareFn?: (a: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }, b: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }) => number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        toSpliced(start: number, deleteCount: number, ...items: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[]): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        toSpliced(start: number, deleteCount?: number): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        with(index: number, value: {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }): {
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }[];
        [Symbol.iterator](): IterableIterator<{
            new (gp: any): {
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
                readonly ls: {
                    x: number;
                    y: number;
                };
                readonly rs: {
                    x: number;
                    y: number;
                };
                readonly lb: any;
                readonly rb: any;
                readonly leftStickButton: any;
                readonly rightStickButton: any;
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
            };
        }>;
        readonly [Symbol.unscopables]: {
            [x: number]: boolean;
            length?: boolean;
            toString?: boolean;
            toLocaleString?: boolean;
            pop?: boolean;
            push?: boolean;
            concat?: boolean;
            join?: boolean;
            reverse?: boolean;
            shift?: boolean;
            slice?: boolean;
            sort?: boolean;
            splice?: boolean;
            unshift?: boolean;
            indexOf?: boolean;
            lastIndexOf?: boolean;
            every?: boolean;
            some?: boolean;
            forEach?: boolean;
            map?: boolean;
            filter?: boolean;
            reduce?: boolean;
            reduceRight?: boolean;
            find?: boolean;
            findIndex?: boolean;
            fill?: boolean;
            copyWithin?: boolean;
            entries?: boolean;
            keys?: boolean;
            values?: boolean;
            includes?: boolean;
            flatMap?: boolean;
            flat?: boolean;
            at?: boolean;
            findLast?: boolean;
            findLastIndex?: boolean;
            toReversed?: boolean;
            toSorted?: boolean;
            toSpliced?: boolean;
            with?: boolean;
            [Symbol.iterator]?: boolean;
            readonly [Symbol.unscopables]?: boolean;
        };
    };
    isArray(arg: any): arg is any[];
    from<T>(arrayLike: ArrayLike<T>): T[];
    from<T_1, U_4>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U_4, thisArg?: any): U_4[];
    from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
    from<T_3, U_5>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_5, thisArg?: any): U_5[];
    of<T_4>(...items: T_4[]): T_4[];
    readonly [Symbol.species]: ArrayConstructor;
};
var renderStats: any;
type planck = any;
namespace planck {
    type Vec2 = any;
    type Body = any;
    type Fixture = any;
    type World = any;
    type Contact = any;
}

}
