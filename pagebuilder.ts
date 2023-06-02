

class PageBuilder {

    private static getHeader(page: string): string {
        var header = '\
        <div id="wrapper">\
            <h1 style=\"padding:15px;">Code Along at https://tinyurl.com/ct5nrhtd</h1>\
            <div id="nav">\
            <ul>';
        var links = new Array("Setting the Scene", "index.html", "Graphics Pipeline", "pipeline.html", "Loading Data", "loading.html", "Camera Control", "camera.html", "Lighting", "lighting.html");
        for (var i = links.length - 2; i >= 0; i -= 2) {
            header = header + '<li';
            if (links[i + 1] == page) {
                header = header + ' class="selected"';
            }
            header = header + '>\
                <a href="' + links[i + 1] + '">' + links[i] + '</a>\
                </li>';
        }
        header = header + '\
            </ul>\
            </div>\
            <div id="content">';
        return header;
    }


    public static writeHeader(callbackSignature: string, page: string): void {
        document.write(this.getHeader(page));
        document.write("<canvas width = \"500\" height = \"500\" id = \"webGLCanvas\"></canvas>");
        this.writeForm(callbackSignature);
    }

    public static writeHeader2(page: string): void {

        document.write(this.getHeader(page));
    }

    private static writeForm(callbackSignature: string): void {
        document.write("<form action=\"javascript:" + callbackSignature + "()\">\
            <textarea id=\"code\" name=\"vs\" rows=\"15\" cols=\"50\"></textarea>\
              <input type=\"submit\" value=\"Update\">\
            </form>");
    }

    public static writeFooter(): void {
        document.write("</div><div id=\"footer\"><p><b>Simon Grey</b> - <i>S.Grey@hull.ac.uk</i></p></div></div>");
    }
}

