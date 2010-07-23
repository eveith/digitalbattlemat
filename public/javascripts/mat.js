/* mat.js -- The Digital Battle Mat object
 * Copyright (C) 2010  Eric MSP Veith <eveith@wwweb-library.net>
 *
 * See the file COPYING in the application's main directory for the license.
 */


var BattleMatCell = Class.create({

    /**
     * The cell's (HTML-) ID in the form "mat-cell-" + x "x" + y.
     */
    ID: null,


    /** The x coordinate */
    x: null,


    /** The y coordinate */
    y: null,


    /**
     * The CSS visibility attribute: A tile is invisible when it is outside
     * the mat's current dimensions.
     */
    visibility: "visible",


    /**
     * An object storing the <td> elements associated with the cell, both in
     * the mini as well as in the full-sized mat.
     */
    element: {
        miniMat: "mat-mini-cell-",
        mat: "mat-cell-"
    },


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
     * Constructs a new cell on the given coordinates.
     *
     * @param x The column
     * @param y The row
     */
    initialize: function(x, y) {
        this.x = x;
        this.y = y;
        this.ID = "mat-cell-" + x + "x" + y;


        // Create <td> elements that make up the cell, thereby replacing the
        // this.element attribute to make sure following incarnations don't
        // pick up the changed stuff. (Refs v. copies...)

        var element = {};
        ["mat", "miniMat"].each(function(n, i) {
            var id = this.element[n] + x + "x" + y;
            element[n] = new Element('td', {
                id: id,
                style: "visibility: " + this.visibility
            });


            // Add event handler for highlighting. Save this object's instance
            // in a new attribute called "cell" so that we can access it from
            // within the event handler.

            element[n].cell = this;
            element[n].observe('mouseover', this.highlight);
            element[n].observe('mouseout', this.dehighlight);
        }, this);
        this.element = element;

        // Create tile

        this.setTile("/images/textures/tiles/Spacer.png");
    },

    
    /**
     * Sets the tile for the cell.
     *
     * @param url The URI referencing the tile image
     */
    setTile: function(url) {
        this.tile = { miniMat: null, mat: null };
        ["mat", "miniMat"].each(function(n, i) {
            this.tile[n] = new Element('img', { src: url });
            this.element[n].update(this.tile[n]);
        }, this);

        return this;
    },


    /**
     * Highlights the cell; automatically called by the onMouseOver handler of
     * the cell's <td> element.
     *
     * @see dehighlight
     */
    highlight: function(event) {
        // "this" refers to the element, not the class instance, but we
        // patched the prototype.
        var cell = this.cell;

        this.cell.highlighter = new PeriodicalExecuter(function(pe) {
            ["mat", "miniMat"].each(function(n, i) {
                var e = cell.element[n];
                if(e.hasClassName("highlighted-0")) {
                    e.removeClassName("highlighted-0");
                    e.addClassName("highlighted-1");
                } else {
                    e.removeClassName("highlighted-1");
                    e.addClassName("highlighted-0");
                }
            }, this);
        }, 0.5);
    },


    /**
     * Removes the visual highlight from a cell's <td> object when the mouse
     * leaves it.
     *
     * @see highlight
     */
    dehighlight: function(event) {
        // "this" refers to the element, not the class instance, but we
        // patched the prototype.

        ["mat", "miniMat"].each(function(n, i) {
            this.cell.element[n].removeClassName("highlighted-0");
            this.cell.element[n].removeClassName("highlighted-1");
        }, this);

        if(null != this.cell.highlighter) {
            this.cell.highlighter.stop();
            this.cell.highlighter = null;
        }
    },


    /**
     * Sets the cell's visiblity on both mats, ignoring values other than
     * "visible" or "hidden".
     *
     * @param v The CSS-style visiblity, i.e., either "visible" or "hidden".
     */
    setVisibility: function(v) {
        if("visible" != v && "hidden" != v) return this;

        this.visibility = v;
        ["mat", "miniMat"].each(function(n, i) {
            this.element[n].style.visibility = v;
        }, this);
    }
});


/**
 * A BattleMat object instance is responsible for the whole HTML-Fu and JS-Fu
 * involved in creating and maintaining a mat and interacting with it. It
 * needs the ID strings of two HTML containers (i.e., div tags) that shall
 * contain the mat later on.
 *
 * @param ID The mat's database ID for AJAX queries
 * @see setMiniMatContainerID setMatContainerID setDescriptionContainerID
 *  setSize setAuthenticityToken
 */
var BattleMat = Class.create({
    /**
     * The mat's width in cells
     */
    width: 0,


    /**
     * The mat's height in cells
     */
    height: 0,


    /**
     * A textual description of the mat as stored in the database
     */
    description: "",


    /**
     * The fullscreen mat window reference
     *
     * @see openFullscreenWindow
     */
    fullscreenWindow: null,


    /**
     * Create a new instance of a battle mat.
     * 
     * @param ID The mat's ID in the database, e.g. for queries in the form
     *  "/mats/ID"
     */
    initialize: function(ID) {
        this.ID = ID;

        // Pre-define instance variables for various container elements.

        this.descriptionContainerID = null;
        this.descriptionContainer = null;
        this.miniMatContainerID = null;
        this.miniMatContainer = null;
        this.matContainerID = null;
        this.matContainer = null;

        // The big mat's window and the authenticity token for AJAX requests:

        this.matWindow = null;
        this.authenticityToken = null;

        // The bookkeeping array: Row x Column

        this.mat = new Array();

        // Get mat info via AJAX from "show" controller. Read description,
        // dimension and tile placement from it, and initialize these
        // variables.
        // TODO: Refactor.

        var mat = this;
        new Ajax.Request("/mats/" + ID + ".json", {
            method: "GET",
            asynchronous: false,
            onSuccess: function(transport) {
                var savedMat = transport.responseJSON.battle_mat;

                mat.description = savedMat.description;
                mat.width = savedMat.width;
                mat.height = savedMat.height;

                for(var r = 0; r != mat.height; ++r) {
                    mat.mat[r] = new Array();
                    for(var c = 0; c != mat.width; ++c) {
                        // Create a cell object for exactly that position.
                        // Check the transmitted information for additional
                        // stuff, e.g. visibility or a tile.

                        cell = new BattleMatCell(c, r);
                        for(var t in savedMat.battle_mat_tiles) {
                            savedCell = savedMat.battle_mat_tiles[t];
                            if(c == savedCell.x_position
                                    && r == savedCell.y_position) {
                                cell.setVisibility(savedCell.visibility);
                                cell.setTile(savedCell.tile_source);
                                continue;
                            }
                        }
                        mat.mat[r][c] = cell;
                    }
                }
            }
        });
    },


    /**
     * Opens the fullscreen mat window
     */
    openFullscreenWindow: function() {
        this.fullscreenWindow = window.open("/mats/" + this.ID, "matWindow",
			"location=no,menubar=no,resizable=yes,left=0,screenX=0,top=0," +
			"screenY=0,status=no,toolbar=no,scrollbars=no," +
			"width=100%,height=100%");
    },


    /**
     * Sets the ID string of the description container <div> element.
     */
    setDescriptionContainerID: function(ID) {
        this.descriptionContainerID = ID;
        this.descriptionContainer = $(ID);

        return this;
    },


    /**
     * Sets the HTML ID string of the mini mat container <div> element.
     */
    setMiniMatContainerID: function(ID) {
        this.miniMatContainerID = ID;
        this.miniMatContainer = $(ID);

        return this;
    },


    /**
     * Sets the HTML ID string of the mat container <div> element.
     */
    setMatContainerID: function(ID) {
        this.MatContainerID = ID;
        this.MatContainer = $(ID);

        return this;
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
     * @param width
     * @param height
     */
    setSize: function(width, height) {
        // Init bookkeeping.

        for(var row = 0; row != height; ++row) {
            this.mat[row] = [];

            for(var column = 0; column != width; ++column) {
                this.mat[row][column] = new BattleMatCell(row, column);
            }
        }

        
        // Finally, record current values

        this.width = width;
        this.height = height;

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
     * Creates a mat within the designated container.
     * 
     * @param container The mat container
     */
    build: function(container) {
       for(e in container.childElements()) {
          e.remove();
       } 

       for(row in this.mat) {
           for(cell in row) {
           }
       }
    },


    /**
     * This method completely draws the mini mat. It does so by emptying the
     * container completely and recreating every HTML object from the
     * scratch. It does not, however, kill the internal bookkeeping.
     */
    buildMiniMat: function() {
        this.miniMatContainer.update(null);

        var table = new Element('table');
        this.miniMatContainer.insert(table);

        for(var row = 0; row != this.height; ++row) {
            var tr = new Element('tr');
            table.insert(tr);

            for(var column = 0; column != this.width; ++column) {
                tr.insert(this.mat[row][column].element.miniMat);
            }
        }
    },

    
    /**
     * This method completely draws the fullsize mat. It does so by emptying
     * the container completely and recreating every HTML object from the
     * scratch. It does not, however, kill the internal bookkeeping.
     */
    buildMat: function() {
    },


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
