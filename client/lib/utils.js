var Offsets = {
    headerUser: function(offset) {
        return { left: (offset.left - 118), top: (offset.top + 40) }
    },
    list: function(offset) {
        return { left: (offset.left + 230), top: (offset.top + 25) }
    },
    boardName: function(offset) {
        return { left: (offset.left), top: (offset.top + 35) }
    },
    boardPermission: function(offset) { 
        return this.boardName(offset); 
    },
    boardRemove: function(offset) {
        return { left: (offset.left - 61), top: (offset.top - 8) }
    },
    membersAdd: function(offset) {
        return { left: (offset.left - 61), top: (offset.top + 35) }
    }
};

Utils = {
    error: function(err) {
        Session.set("error", (err && err.message || false));       
    },

    is_authenticated: function() {
        return Meteor.user() ? true : false;
    },

    resizeHeight: function(selector, callback) {
        return function() {
            var board = jQuery(selector);
            board.height($(window).height() - 100);
            
            // call
            callback && callback();
        }
    },

    // scroll
    Scroll: function(selector) {
        var $el = $(selector);
        return {
            top: function(px, add) {
                var t = $el.scrollTop();
                $el.animate({ scrollTop: (add ? (t + px) : px) });
            },
            left: function(px, add) {
                var l = $el.scrollLeft();
                $el.animate({ scrollLeft: (add ? (l + px) : px) });
            }
        };
    },

    // Pop
    Pop: {
        getOffset: function($el) {
            var $this = $($el),
                offset = Offsets[$this.attr('popOffset')]($this.offset());
            return offset;
        },
        open: function(template, label, $el, data) {
            var offset = this.getOffset($el);
            Session.set('pop', { 
                template: template, 
                label: label,
                left: offset.left, 
                top: offset.top,
                data: data || {}
            });
        },
        close: function() {
            Session.set('pop', false);
        }
    },

    // memberType admin $or normal
    isMemberFilter: function(filter) {
        return (this.is_authenticated() && BoardMembers.findOne(filter));
    },

    isMemberAdmin: function(yes, no) {
        var filter = { userId: Meteor.userId(), memberType: 'admin' };
        return this.isMemberFilter(filter) ? yes : no;
    },

    isMemberNormal: function(yes, no) {
        var filter = { userId: Meteor.userId(), memberType: 'normal' };
        return this.isMemberFilter(filter) ? yes : no;
    },

    isMemberAll: function(yes, no) {
        var filter = { 
            $or: [ 
                { userId: Meteor.userId(), memberType: 'admin' },
                { userId: Meteor.userId(), memberType: 'normal' }
            ]
        };
        return this.isMemberFilter(filter) ? yes : no;
    }
};
