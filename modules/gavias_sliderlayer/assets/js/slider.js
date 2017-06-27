var $settings = drupalSettings.gavias_sliderlayer.settings,
    $group_settings = drupalSettings.gavias_sliderlayer.group_settings,
    $layers = drupalSettings.gavias_sliderlayer.layers_settings,
    $cxt = 0;
"null" == $layers && ($layers = new Array), "null" == $settings && ($settings = {}), "null" == $group_settings && ($group_settings = {
    startwidth: 1170,
    startheight: 600
});
var delayer = drupalSettings.gavias_sliderlayer.delayer,
    deslider = drupalSettings.gavias_sliderlayer.deslider,
    key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
base64Encode = function(a) {
        var b, c, d, e, f, g, h, i = "",
            j = 0;
        for (a = UTF8Encode(a); j < a.length;) b = a.charCodeAt(j++), c = a.charCodeAt(j++), d = a.charCodeAt(j++), e = b >> 2, f = (3 & b) << 4 | c >> 4, g = (15 & c) << 2 | d >> 6, h = 63 & d, isNaN(c) ? g = h = 64 : isNaN(d) && (h = 64), i = i + key.charAt(e) + key.charAt(f) + key.charAt(g) + key.charAt(h);
        return i
    }, UTF8Encode = function(a) {
        a = a.replace(/\x0d\x0a/g, "\n");
        for (var b = "", c = 0; c < a.length; c++) {
            var d = a.charCodeAt(c);
            128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128))
        }
        return b
    }, GaviasCompare = function(a, b) {
        return a.index < b.index ? -1 : a.index > b.index ? 1 : 0
    },
    function(a) {
        function b(b, c) {
            a.notify({
                title: "Notification",
                text: c,
                image: '<i class="fa fa-bell" style="font-size: 30px;color: #fff;"></i>',
                hideAnimation: "slideUp"
            }, {
                style: "metro",
                className: b,
                autoHide: !0,
                clickToHide: !0
            })
        }

        function c() {
            $settings = a.extend(!0, deslider, $settings), "" != $settings.background_image_uri ? a("#gavias_slider_single").css({
                "background-image": "url(" + drupalSettings.gavias_sliderlayer.base_url + $settings.background_image_uri + ")"
            }) : a("#gavias_slider_single").css({
                backgroundImage: "none"
            }), jQuery(".slide-option").each(function(a) {
                void 0 !== $settings[jQuery(this).attr("name")] ? jQuery(this).val($settings[jQuery(this).attr("name")]) : jQuery(this).val("")
            }), f()
        }

        function d() {
            a("input.slide-option, select.slide-option").each(function(b) {
                $settings[a(this).attr("name")] = a(this).val()
            })
        }

        function e(b, c, d) {
            b.title = b.title || "Layer " + (c + 1);
            var e = a("<span>").text($layers[c].title),
                f = a("<span>").text("").addClass("remove-layer fa fa-times"),
                g = a("<span>").text("").addClass("fa fa-clone"),
                h = a("<span>").text("").addClass("move fa fa-arrows");
            e.click(function() {
                m(), k(c)
            }), g.click(function() {
                m(), i(c)
            }), f.click(function() {
                n(c)
            }), d.append(e).append(f).append(g).append(h)
        }

        function f() {
            a("#gavias_slider_single").find("div").remove(), a("#gavias_list_layers").find("li").remove(), void 0 === $layers && ($layers = new Array), a($layers).each(function(a) {
                $layers[a] && 1 != $layers[a].removed && h(a)
            }), a(".layer-option").val(""), void 0 !== $layers[0] && k(0)
        }

        function g() {
            m();
            var b = $layers.length;
            $layers[b] = {}, $start_layer = 0, a.each($layers, function(a, b) {
                parseInt(b.data_time_start) > $start_layer && ($start_layer = b.data_time_start)
            }), delayer.data_time_start = parseInt($start_layer) + 500, a.extend(!0, $layers[b], delayer), h(b), k(b)
        }

        function h(b) {
            var f = $layers[b].type,
                g = a("<li>").attr("index", b).addClass(f);
            e($layers[b], b, g), a("ul#gavias_list_layers").append(g);
            var h = a("<div>").addClass("layer tp-caption").attr("id", "layer-" + b);
            h.addClass("caption"), void 0 === $layers[b].text_style && ($layers[b].text_style = "text"), "text" == $layers[b].type && h.addClass($layers[b].text_style);
            var i = "";
            switch ($layers[b].type) {
                case "image":
                    i = '<img src="' + (drupalSettings.gavias_sliderlayer.base_url + $layers[b].image_uri) + '" />';
                    var n = new Image;
                    n.onload = function() {
                        h.width($layers[b].width || this.width), h.height($layers[b].height || this.height)
                    }, n.src = drupalSettings.gavias_sliderlayer.base_url + $layers[b].image_uri;
                    break;
                case "text":
                    i = $layers[b].text
            }
            var o = a("<div>").addClass("inner");
            $layers[b].custom_css && o.attr("style", $layers[b].custom_css), $layers[b].custom_class && o.addClass($layers[b].custom_class), $layers[b].custom_style && o.addClass($layers[b].custom_style), o.html(i), h.append(o);
            var p = 99 - $layers[b].index;
            h.mousedown(function() {
                m(), k(b)
            }).draggable({
                containment: "parent",
                drag: function(c, d) {
                    d.helper.width("auto"), d.helper.height("auto");
                    var e = a("input[name=left]").val();
                    "center" == e ? (a("input[name=left]").val("center"), a("input[name=top]").val(d.position.top), d.position.left = "50%", l(b, d.position.top, d.position.left), d.helper.css("margin-left", d.helper.width / 2)) : "left" == e ? (a("input[name=left]").val("left"), a("input[name=top]").val(d.position.top), d.position.left = "10", d.position.right = "auto", l(b, d.position.top, d.position.left)) : "right" == e ? (a("input[name=left]").val("right"), a("input[name=top]").val(d.position.top), d.position.left = "auto", d.position.right = "0", l(b, d.position.top, d.position.left)) : (a("input[name=left]").val(d.position.left), a("input[name=top]").val(d.position.top), l(b, d.position.top, d.position.left))
                },
                grid: [5, 5]
            }).resizable({
                aspectRatio: "image" == $layers[b].type,
                resize: function(b, c) {
                    a("input[name=width]").val(c.size.width), a("input[name=height]").val(c.size.height)
                }
            }), a("#gavias_slider_single").append(h);
            var q = $layers[b].left,
                r = $layers[b].type,
                s = h.width();
            "image" == r && (s = $layers[b].width), "center" == q ? h.css({
                left: "50%",
                "margin-left": -s / 2
            }) : "left" == q ? h.css({
                left: 0
            }) : "right" == q ? h.css({
                right: 0
            }) : h.css({
                left: q + "px"
            }), h.css({
                top: $layers[b].top + "px",
                zIndex: p
            }), a("#layeroptions").show(0), a("#gavias_list_layers").sortable({
                handle: ".move",
                update: function(b, e) {
                    a("#gavias_list_layers").find("li").each(function(b) {
                        var c = a(this).attr("index");
                        $layers[c].index = b, a("#layer-" + c).css({
                            zIndex: 99 - b
                        }), m()
                    }), $layers.sort(GaviasCompare), d(), c()
                }
            })
        }

        function i(b) {
            m();
            var c = $layers.length;
            $layers[c] = {}, $start_layer = 0, a.each($layers, function(a, b) {
                parseInt(b.data_time_start) > $start_layer && ($start_layer = b.data_time_start)
            }), a.extend(!0, $layers[c], $layers[b]), h(c), k(c)
        }

        function j(b) {
            if (a(".g-content-setting").each(function() {
                    a(this).css("display", "none")
                }), a("#content-" + b).css("display", "block"), $layers[$cxt].type = b, a("ul#gavias_list_layers li.active").removeClass("image text").addClass(b), "image" == b) {
                var c = a("#0-" + $cxt).resizable("option");
                a("#layer-" + $cxt).resizable("destroy"), c.aspectRatio = !0, a("#layer-" + $cxt).resizable(c)
            } else if ("text" == b) {
                a("#content-" + b).find("textarea[id=layer-text]").trigger("keyup");
                var d = a("#layer-" + $cxt).resizable("option");
                a("#layer-" + $cxt).resizable("destroy"), d.aspectRatio = !1, a("#layer-" + $cxt).resizable(d)
            }
        }

        function k(b) {
            $cxt = b, a(".layer").removeClass("selected"), a("#layer-" + b).addClass("selected"), a("ul#gavias_list_layers").find("li").removeClass("active"), a("ul#gavias_list_layers").find("li[index=" + b + "]").addClass("active"), a(".layer-option").each(function(c) {
                void 0 !== $layers[b][a(this).attr("name")] ? "data_time_end" == a(this).attr("name") || "data_time_start" == a(this).attr("name") ? a(this).val($layers[b][a(this).attr("name")]).trigger("change") : a(this).val($layers[b][a(this).attr("name")]) : a(this).val("")
            }), j($layers[b].select_content_type), a(".select-content-type").change(function() {
                j(a(this).val())
            })
        }

        function l(a, b, c) {
            $layers[a].top = b, $layers[a].left = c
        }

        function m() {
            0 != $layers.length && a(".layer-option").each(function(b) {
                "undefined" != a(this) && ($layers[$cxt][a(this).attr("name")] = a(this).val())
            })
        }

        function n(b) {
            if (a("#layer-" + b).remove(), $layers[b].removed = 1, a("ul#gavias_list_layers").find("li[index=" + b + "]").remove(), b == $cxt && a("ul#gavias_list_layers li").length > 0) {
                k(parseInt(a("ul#gavias_list_layers").find("li:first").attr("index")))
            }
        }

        function o() {
            d(), m();
            var c = [];
            $layers.sort(GaviasCompare), a.each($layers, function(a, b) {
                0 == b.removed && (c[c.length] = b)
            }), $layers = c;
            var e = a.extend(!0, {}, $settings),
                f = base64Encode(JSON.stringify(e)),
                g = base64Encode(JSON.stringify(c)),
                h = a("input[name=gid]").val(),
                i = a("input[name=sid]").val(),
                j = a("input[name=title]").val(),
                k = a("input[name=sort_index]").val(),
                l = a("select[name=status]").val(),
                n = a("input[name=background_image_uri]").val(),
                o = {
                    sort_index: k,
                    status: l,
                    title: j,
                    sid: i,
                    gid: h,
                    background_image_uri: n,
                    datalayers: g,
                    settings: f
                };
            a.ajax({
                url: drupalSettings.gavias_sliderlayer.save_url,
                type: "POST",
                data: o,
                dataType: "json",
                success: function(c) {
                    a("#save").val("Save"), b("success", "Slider updated"), a("#save").removeAttr("disabled"), window.location = c.url_edit
                },
                error: function(c, d, e) {
                    b("black", "Slider not updated"), a("#save").removeAttr("disabled")
                }
            })
        }
        a(window).load(function() {
            a('input[name*="video_youtube_args"').val() || a('input[name*="video_youtube_args"').val("version=3&enablejsapi=1&html5=1&hd=1&wmode=opaque&showinfo=0&ref=0;origin=http://server.local;autoplay=1;"), a('input[name*="video_vimeo_args"').val() || a('input[name*="video_vimeo_args"').val("title=0&byline=0&portrait=0&api=1")
        }), a(document).ready(function() {
            function h(b) {
                var c = "layer-" + $cxt,
                    d = a("<img>").attr("src", b);
                a("#" + c).find(".inner").html(d);
                var e = new Image;
                e.onload = function() {
                    a("#" + c).width(this.width), a("#" + c).height(this.height), a("input[name=width]").val(this.width), a("input[name=height]").val(this.height)
                }, e.src = b
            }

            function i(a) {
                jQuery("#gavias_slider_single").css({
                    backgroundImage: "url(" + a + ")"
                })
            }
            var b = 9e3;
            $group_settings.delay && (b = $group_settings.delay);
            var d = document.getElementById("g-slider");
            noUiSlider.create(d, {
                start: [20, parseInt(b) - 20],
                margin: 20,
                connect: !0,
                behaviour: "tap-drag",
                range: {
                    min: 0,
                    max: parseInt(b)
                },
                pips: {
                    mode: "steps",
                    density: 2
                }
            });
            var e = document.getElementById("g_data_end"),
                f = document.getElementById("g_data_start");
            d.noUiSlider.on("update", function(a, b) {
                b ? e.value = a[b] : f.value = a[b]
            }), a("#g_data_end").on("change", function() {
                d.noUiSlider.set([null, this.value])
            }), a("#g_data_start").on("change", function() {
                d.noUiSlider.set([this.value, null])
            }), a("select[name=text_style]").change(function() {
                a(".layer[id=layer-" + $cxt + "] .inner").attr("class", "inner " + $layers[$cxt].custom_class + " " + $layers[$cxt].custom_style), a(".layer[id=layer-" + $cxt + "] .inner").addClass(a(this).val());
                var b = $layers[$cxt].left;
                "center" == b ? a("#layer-" + $cxt).css({
                    left: "50%",
                    "margin-left": -a("#layer-" + $cxt).width() / 2
                }) : "left" == b ? a("#layer-" + $cxt).css({
                    left: 0
                }) : "right" == b && a("#layer-" + $cxt).css({
                    right: 0
                })
            }), a("#content-type").find("#layer-text").keyup(function() {
                $layers[$cxt].text = a(this).val(), a("#layer-" + $cxt).find(".inner").html(a(this).val());
                var b = $layers[$cxt].left;
                "center" == b ? a("#layer-" + $cxt).css({
                    left: "50%",
                    "margin-left": -a("#layer-" + $cxt).width() / 2
                }) : "left" == b ? a("#layer-" + $cxt).css({
                    left: 0
                }) : "right" == b && a("#layer-" + $cxt).css({
                    right: 0
                })
            }), a("[name=custom_css]").keyup(function() {
                $layers[$cxt].custom_css = a(this).val(), a("#layer-" + $cxt).find(".inner").attr("style", a(this).val())
            }), a("[name=custom_class]").change(function() {
                $layers[$cxt].custom_class = a(this).val(), a("#layer-" + $cxt).find(".inner").attr("class", "inner"), a("#layer-" + $cxt).find(".inner").addClass(a(this).val()), a("#layer-" + $cxt).find(".inner").addClass(a(this).parents(".fieldset-wrapper").find("[name=custom_style]").val())
            }), a("[name=custom_style]").change(function() {
                $layers[$cxt].custom_style = a(this).val(), a("#layer-" + $cxt).find(".inner").attr("class", "inner"), a("#layer-" + $cxt).find(".inner").addClass(a(this).val()), a("#layer-" + $cxt).find(".inner").addClass(a(this).parents(".fieldset-wrapper").find("[name=custom_class]").val())
            }), a("#gavias_slider_single").width($group_settings.startwidth).height($group_settings.startheight), a("input[name=top]").change(function() {
                a("#layer-" + $cxt).css({
                    top: a(this).val() + "px"
                })
            }), a("input[name=left]").on("change", function() {
                "center" == a(this).val() ? a("#layer-" + $cxt).css({
                    left: "50%",
                    "margin-left": -a("#layer-" + $cxt).width() / 2
                }) : "left" == a(this).val() ? a("#layer-" + $cxt).css({
                    left: 0,
                    "margin-left": 0
                }) : "right" == a(this).val() ? a("#layer-" + $cxt).css({
                    right: 0,
                    "margin-left": 0
                }) : a("#layer-" + $cxt).css({
                    left: a(this).val() + "px",
                    "margin-left": 0
                })
            }), a("input[name=width]").change(function() {
                a("#layer-" + $cxt).css({
                    width: a(this).val() + "px"
                })
            }), a("input[name=height]").change(function() {
                a("#layer-" + $cxt).css({
                    height: a(this).val() + "px"
                })
            }), c(), a("#add_layer").click(function() {
                return g(), !1
            }), a("#save").click(function() {
                a(this).attr("disabled", "true"), o()
            }), a("input#g-image-layer").on("onchange", function() {
                $url = drupalSettings.gavias_sliderlayer.base_url + a(this).val(), h($url)
            }), a("input#background-image").on("onchange", function() {
                $url = drupalSettings.gavias_sliderlayer.base_url + a(this).val(), i($url)
            })
        }), window.set_layer_position = l
    }(jQuery);