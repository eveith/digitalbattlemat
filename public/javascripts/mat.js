/* mat.js -- The Digital Battle Mat object
 * Copyright (C) 2010  Eric MSP Veith <eveith@wwweb-library.net>
 *
 * See the file COPYING in the application's main directory for the license.
 */


var BattleMatCell = Class.create({
    initialize: function(x, y) {
        this.x = x;
        this.y = y;
        this.ID = "mat-cell-" + x + "x" + y;
        this.visibility = "visible";


        // Create <td> elements that make up the cell

        this.element = {
            miniMat: new Element('td', { id: "mat-mini-cell-" + x + "x" + y }),
            mat: new Element('td', { id: "mat-cell-" + x + "x" + y })
        };

        // Create tile

        this.tile = {
            miniMat: null,
            mat: null
        };
        this.setTile("/images/textures/tiles/Spacer.png");
    },

    
    /**
     * Sets the tile for the cell.
     *
     * @param url The URI referencing the tile image
     */
    setTile: function(url) {
        this.tile.miniMat = new Element('img', { src: url });
        this.element.miniMat.update(this.tile.miniMat);
        this.tile.mat = new Element('img', { src: url });
        this.element.mat.update(this.tile.mat);
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

        this.width = 0;
        this.height = 0;
        this.description = "";

        var mat = this;
        new Ajax.Request("/mats/" + ID + ".json", {
            method: "GET",
            asynchronous: false,
            onSuccess: function(transport) {
                var battle_mat = transport.responseJSON.battle_mat;

                mat.description = battle_mat.description;
                mat.width = battle_mat.width;
                mat.height = battle_mat.height;

                for(var r = 0; r != mat.height; ++r) {
                    mat.mat[r] = new Array();
                    for(var c = 0; c != mat.width; ++c) {
                        mat.mat[r][c] = new BattleMatCell(c, r);
                    }
                }
            }
        });
    },


    /**
     */
    retrieveInformation: function() {
        return this;
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
        this.width = width;
        this.height = height;

        // Init bookkeeping.

        for(var row = 0; row != height; ++row) {
            this.mat[row] = [];

            for(var column = 0; column != width; ++column) {
                this.mat[row][column] = new BattleMatCell(row, column);
            }
        }

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
