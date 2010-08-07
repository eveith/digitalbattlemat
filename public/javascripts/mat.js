/* mat.js -- The Digital Battle Mat object
 * Copyright (C) 2010  Eric MSP Veith <eveith@wwweb-library.net>
 *
 * See the file COPYING in the application's main directory for the license.
 */


var BattleMatCell = Class.create({

    /** The x coordinate */
    x: null,


    /** The y coordinate */
    y: null,


    /**
     * The CSS visibility attribute: A tile is invisible when it is outside
     * the mat's current dimensions.
     */
    visibility: "visible",


    /** An object storing the <td> element associated with the cell. */
    element: null,


    /**
     * An object storing the relative URIs to the tile image displayed.
     */
    tile: null,


    /**
     * A highlighter pseudo-process that is responsible for a nice blinking
     * effect.
     */
    highlighter: null,


    /**
     * A list of other objects that are to be notified on changes, like
     * changing the tile or mouse events.
     */
    observers: [],


    /**
     * Constructs a new cell on the given coordinates.
     *
     * @param x The column
     * @param y The row
     */
    initialize: function(x, y) {
        this.x = x;
        this.y = y;
        this.observers = [];

        // Create <td> elements that make up the cell, thereby replacing the
        // this.element attribute to make sure following incarnations don't
        // pick up the changed stuff. (Refs v. copies...)

        this.element = new Element('td',
                { style: "visibility" + this.visibility });

        // Add event handler for (de-) highlighting.

        var that = this;
        this.element.observe("mouseover", function(event) {
            that.highlight();
        });
        this.element.observe("mouseout", function(event) {
            that.dehighlight();
        });

        // Create tile, set default blank spacer image.

        this.setTile("/images/textures/tiles/Spacer.png");
    },

    
    /**
     * Sets the tile for the cell.
     *
     * @param url The URI referencing the tile image
     */
    setTile: function(url) {
        if(null === this.tile)
            this.tile = new Element('img');

        this.tile.src = url;

        this.notifyObservers();

        return this;
    },


    /**
     * Highlights the cell; automatically called by the onMouseOver handler of
     * the cell's <td> element.
     *
     * @see dehighlight
     */
    highlight: function() {
        var e = this.element;

        this.highlighter = new PeriodicalExecuter(function(pe) {
            if(e.hasClassName("highlighted-0")) {
                e.removeClassName("highlighted-0");
                e.addClassName("highlighted-1");
            } else {
                e.removeClassName("highlighted-1");
                e.addClassName("highlighted-0");
            }
        }, 0.5);

        this.notifyObservers();

        return this;
    },


    /**
     * Removes the visual highlight from a cell's <td> object when the mouse
     * leaves it.
     *
     * @see highlight
     */
    dehighlight: function() {
        this.element.removeClassName("highlighted-0");
        this.element.removeClassName("highlighted-1");

        if(null != this.highlighter) {
            this.highlighter.stop();
            this.highlighter = null;
        }

        this.notifyObservers();

        return this;
    },


    /**
     * Sets the cell's visiblity on both mats, ignoring values other than
     * "visible" or "hidden".
     *
     * @param v The CSS-style visiblity, i.e., either "visible" or "hidden".
     */
    setVisibility: function(v) {
        if("visible" !== v && "hidden" !== v) return this;

        this.element.style.visibility = this.visibility;

        this.notifyObservers();

        return this;
    },


    /**
     * Show the cell by setting its CSS visibility attribute to "visible".
     *
     * @see setVisibility
     */
    show: function() {
        this.setVisibility("visibile");
        return this;
    },


    /**
     * Hide the cell by settings its CSS visibility attribute to "hidden".
     *
     * @see setVisibility
     */
    hide: function() {
        this.setVisibility("hidden");
        return this;
    },


    /**
     * Adds another object instance to the list of observers that are notified
     * on changes. An observer has to implement the notifiy() method call.
     */
    addObserver: function(o) {
        this.observers.push(o);
        return this;
    },


    /**
     * Receives an update from an observed subject.
     *
     * @param subject The subject whose state has changed
     */
    update: function(subject) {
        this.setVisibility(subject.visibility);
        this.setTile(subject.tile.src);

        // Trigger highlighting/dehighlighting
        
        if(null === subject.highlighter)
            this.dehighlight;
        else
            this.highlight();

        return this;
    },


    /**
     * Notifies all observers of a state change.
     */
    notifyObservers: function() {
        for(var i = 0; i != this.observers.length; ++i) {
            this.observers[i].notify(this);
        }
        return this;
    }
});


/**
 * A BattleMat object instance is responsible for the whole HTML-Fu and JS-Fu
 * involved in creating and maintaining a mat and interacting with it. It
 * consists of 0 to many BattleMatCell objects that represent the cells
 * associated with it.
 *
 * You can chain several BattleMat objects together via the observer pattern
 * and the corresponding methods. Changes will then be populated to all
 * observers. This comes handy when two displayed mats share the same data,
 * but are otherwise different, e.g. for a big-sized and a mini mat.
 */
var BattleMat = Class.create({

    /** The mat's width in cells */
    width: 0,


    /** The mat's height in cells */
    height: 0,


    /** A list of objects observing changes to this one */
    observers: [],


    /** The <div> object housing the mat */
    container: null,


    /** A matrix containing the internal bookkeeping of all cells */
    cells: [],


    /** The Rails authenticity token used for AJAX requests */
    authenticityToken: null,


    /**
     * Create a new instance of a battle mat.
     * 
     * @param ID The mat's ID in the database, e.g. for queries in the form
     *  "/mats/ID"
     * @param container The HTML ID of the mat's container element
     */
    initialize: function(ID, container) {
        this.ID = ID;
        this.container = $(container);

        // Get the mat's layout:

        var that = this;
        new Ajax.Request("/mats/" + ID + ".json", {
            method: "GET",
            asynchronous: false,
            onSuccess: function(transport) {
                var savedMat = transport.responseJSON.battle_mat;

                that.setSize(savedMat.width, savedMat.height);

                for(var r = 0; r != that.height; ++r) {
                    that.cells[r] = [];
                    for(var c = 0; c != that.width; ++c) {
                        that.cells[r][c] = new BattleMatCell(c, r);
                    }
                }

                // Apply changes from saved tiles.

                savedMat.battle_mat_tiles.each(function(cell, i) {
                    c = that.cells[cell.y_position][cell.x_position];
                    c.setTile(cell.tile_source);
                    c.setVisibility(cell.visibility);
                }, that);
            },
            onFailure: function(transport) { alert("Meep!"); }
        });
    },


    /**
     * Sets the authenticity token required for AJAX interaction with the
     * underlying rails application.
     */
    setAuthenticityToken: function(token) {
        this.authenticityToken = token;
        return this;
    },


    /**
     * Setter for that mat's absoulte size. It will initialize the internal
     * bookkeeping structure. If the mat's new size is smaller than the old
     * size, information will not be deleted. The unneccessary elements will
     * merely become invisible and re-appear when growing the mat again.
     *
     * @param width The new absolute (visible) width of the mat
     * @param height The new absolute (visible) height of the mat
     */
    setSize: function(width, height) {
        for(var row = 0; row !== height && row !== this.cells.length; ++row) {
            // Init row if not yet present

            if(undefined === this.cells[row]) {
                this.cells[row] = [];
            }

            for(var column = 0;
                    column !== width && column !== this.cells[row].length;
                    ++column) {
                // Create a new cell if the slot is not yet initialized. Else,
                // toggle visibility as neccessary.

                if(undefined === this.cells[row][column]) {
                    this.cells[row][column] = new BattleMatCell(row, column);
                } else {
                    if(column >= width || row >= height) {
                        this.cells[row][column].hide();
                    } else {
                        this.cells[row][column].show();
                    }
                }
            }
        }

        // Finally, record current visible dimensions of the mat, and notify
        // the rest.

        this.width = width;
        this.height = height;

        this.notifyObservers();

        return this;
    },


    /**
     * @return The mat's width
     */
    getWidth: function() {
        return this.width;
    },



    /**
     * @return The mat's height
     */
    getHeight: function() {
        return this.height;
    },


    /**
     * Creates the actual HTML elements that make up the mat within the
     * designated container. When called, it completely empties the container
     * and creates every element from scratch. Normally, one has to call this
     * method only once, i.e. when the mat is initially displayed. However,
     * calling the method more than once will keep the internal matrix intact.
     */
    build: function() {
        var table = new Element('table');

        for(var row = 0; row != this.cells.length; ++row) {
            var tr = new Element('tr');
            table.insert(tr);

            for(var column = 0; column != this.cells[row].length; ++column) {
                tr.insert(this.cells[row][column].element);
            }
        }

        this.container.update(table);

        return this;
    },


    /**
     * Adds another object instance to the list of observers that are notified
     * on changes. An observer has to implement the notifiy() method call.
     */
    addObserver: function(o) {
        this.observers.push(o);
        return this;
    },


    /**
     * Receives an update from an observed subject.
     *
     * @param subject The subject whose state has changed
     */
    update: function(subject) {
        this.setSize(subject.getWidth(), subject.getHeight());

        return this;
    },


    /**
     * Notifies all observers of a state change.
     */
    notifyObservers: function() {
        for(var i = 0; i != this.observers.length; ++i) {
            this.observers[i].notify(this);
        }
        return this;
    },


    // TODO: Refactor the method below into an helper of its own.
    /**
     * Build the mat description blockquote, with all the event handlers
     * included.
     */
    buildDescription: function() {
        var matID = this.ID;
        var authenticityToken = this.authenticityToken;
        var blockquote = new Element('blockquote');

        blockquote.insert(this.description);

        // Add handler for editing

        blockquote.onclick = function(event) {
            var container = $(this.parentNode);
            var blockquote = this;
            var tarea = new Element('textarea');
            var okButton = new Element('div', { class: 'button-ok' });
            var cancelButton = new Element('div', { class: 'button-cancel' });

            tarea.rows = 2;
            tarea.columns = 60;
            tarea.insert(this.firstChild.nodeValue);

            container.update(tarea);
            container.insert(new Element('br'));
            container.insert(okButton).insert("&nbsp;").insert(cancelButton);

            // Add handlers for ok/cancel buttons

            cancelButton.onclick = function(event) {
                container.update(blockquote); 
            };

            okButton.onclick = function(event) {
                var url = window.location.href;
                url = url.replace("/edit", "");

                new Ajax.Request(url, {
                    method: "put",
                    parameters: {
                        'authenticity_token': authenticityToken,
                        'mat[id]': matID,
                        'mat[description]': tarea.value
                    },
                    onSuccess: function(response) {
                        blockquote.update(tarea.value);
                        container.update(blockquote);
                    },
                    onFailure: function(response) {
                        // TODO: A nice error message here.
                        container.update(blockquote); 
                    }
                });
            };
        };

        this.descriptionContainer.update(blockquote);
    }
});
