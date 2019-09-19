//�����������Firefox / Chrome(34 or later) / IE(X86/X64) / ���������...
function NewBrowserObj() {
    var obj = new Object();
    obj.npapi = false; //�Ƿ��Ѱ�װ npapi
    obj.ppapi = false; //�Ƿ��Ѱ�װ ppapi
    obj.chrome_install_apitype = ""; //���Chrome���δ��װ, ������װ������ (npapi, ppapi)
    obj.version = 0;
    var sver = "";
    var agnt = navigator.userAgent.toLowerCase();
    if (agnt.indexOf("edge") > 0) //edge�����
        obj.type = "edge";
    else if (agnt.indexOf("msie") > 0 || agnt.indexOf("trident") > 0) { //ie�����
        obj.type = "ie";
        var off = agnt.indexOf("msie");
        if (off >= 0) sver = agnt.substring(off + 4);
    } else { //chrome �� firefox �����
        if (navigator.mimeTypes["application/supcan-plugin"]) obj.npapi = true; //npapi�Ѿ���װ
        if (navigator.mimeTypes["application/x-ppapi-supcan"]) obj.ppapi = true; //ppapi�Ѿ���װ
        if (agnt.indexOf("chrome") > 0) {
            obj.type = "chrome";
            var off = agnt.indexOf("chrome/");
            if (off >= 0) sver = agnt.substring(off + 7);
        } else
            obj.type = "firefox";
    }

    if (sver != "") {
        var off = sver.indexOf(".");
        if (off > 0) obj.version = parseInt(sver.substr(0, off));
    }

    if (obj.type == "chrome") {
        if (obj.npapi == false && obj.ppapi == false) { //δ��װ���
            if (obj.version < 35 || navigator.mimeTypes.length > 15) //�ϰ汾�� Chrome������������
                obj.chrome_install_apitype = "npapi";
            else
                obj.chrome_install_apitype = "ppapi";
        } else if (obj.npapi && obj.ppapi) { //2 �ֶ���װ��, Ϊ�˼���, 35��ǰ��ʹ�� npapi (ppapiҲ��֧�ֵ�)
            if (obj.version < 35)
                obj.ppapi = false;
            else
                obj.npapi = false;
        }
    }
    obj.is64 = (agnt.indexOf("win64") >= 0 || agnt.indexOf("x64") >= 0) ? true : false;
    return obj;
}

//���������(ȫ�ֶ���)
var $B = NewBrowserObj();

//�� ppapi �﷨���� npapi��Ϊ <object> ���� func( ) ����
if ($B.ppapi) {
    Object.prototype.func = function (funcname, para) {
        return this.postMessageAndAwaitResponse([funcname, para]);
    }
}

//private:
export function bldStr(ctlType, id, para, height) {
    var ctlver = '1.0.109.7';
     
    //ȡ��������ľ���·��(�����dynaload.js������ͬһ��Ŀ¼)
    var SupcanPath = "",
        arrScript = document.getElementsByTagName("script");
    for (var i = 0; i < arrScript.length; i++) {
        var src = arrScript[i].src;
        var index = src.indexOf('dynaload.js');
        if (index >= 0) {
            SupcanPath = src.substring(0, index);
            if (SupcanPath.charAt(0) == '/') {
                src = location.href;
                index = src.indexOf('//');
                if (index != -1) {
                    index = src.indexOf('/', index + 2);
                    if (index != -1) src = src.substring(0, index);
                    SupcanPath = src + SupcanPath;
                }
            }
            break;
        }
    }

    var typeid;
    if ($B.type == "ie") {
        if ($B.is64)
            typeid = 'CLASSID="clsid:11249C26-4BCD-4A74-B4D9-068936D77EFE" Codebase="' + SupcanPath + 'supcan2.x64.cab#Version=1,0,0,3"';
        else
            typeid = 'CLASSID="clsid:619F1AC0-2644-40D3-9EB1-22F81C5FE097" Codebase="' + SupcanPath + 'supcan2.cab#Version=1,0,0,3"';
    } else {
        if ($B.npapi) typeid = 'type="application/supcan-plugin"';
        if ($B.ppapi) typeid = 'type="application/x-ppapi-supcan"';
        if ($B.type == "firefox") typeid += ' Codebase="' + SupcanPath + 'supcan.xpi"';
    }

    //�����URL
    var zipurl = SupcanPath + ($B.is64 ? "BCV1.x64.bin" : "BCV1.bin");
    if (ctlType == "LuxForm")
        zipurl += "," + SupcanPath + ($B.is64 ? "LuxForm.x64.bin" : "LuxForm.bin");
    else if (ctlType.indexOf("BCV4") >= 0)
        zipurl += "," + SupcanPath + ($B.is64 ? "BCV4.x64.bin" : "BCV4.bin");

    //End
    var str = '<Object id=' + id + ' Width=100% height=' + height + ' ' + typeid + '>';
    str += '<param Name="CtlName" Value="' + ctlType + '">';
    str += '<param Name="CtlVersion" Value="' + ctlver + '">';
    str += '<param Name="ZipUrl" Value="' + zipurl + '">';
    str += '<param Name="id" Value="' + id + '">';
    str += '<param Name="Cookie" Value="' + document.cookie + '">';
    str += '<param Name="CtlPara" Value="' + para + '">';
    if ($B.ppapi) str += '<param Name="core" Value="pure"><param Name="Locate" value="' + window.location.href + '">';
    str += '</Object>';
    if ($B.ppapi) { //Ϊ ppapi �����¼���������, ������ֱ�ӵ��� OnReady��OnEvent, �ﵽ�﷨�� npapi ���ݵ�Ŀ��
        str += '\n<script>\n' + id + '.addEventListener("message", handleMessage' + id + ', false);\n'
        str += 'function handleMessage' + id + '(message) {\n if(message.data.name=="OnReady") OnReady("' + id + '");\n else if(message.data.name=="OnEvent") OnEvent("' + id + '", message.data.event, message.data.p1, message.data.p2, message.data.p3, message.data.p4); \n }\n</script>';
    }
    //alert(str);
    return str;
}

//public:
export function insertTreeList(id, para) {
    document.write(bldStr("BCV1.TreeList", id, para, (arguments.length > 2) ? arguments[2] : "100%"))
}

export function insertEdit(id, para) {
    document.write(bldStr("BCV1.Edit", id, para, (arguments.length > 2) ? arguments[2] : "100%"))
}

export function insertReport(id, para) {
    document.write(bldStr("LuxForm", id, para, (arguments.length > 2) ? arguments[2] : "100%"))
}

export function insertTree(id, para) {
    document.write(bldStr("BCV1.Tree", id, para, (arguments.length > 2) ? arguments[2] : "100%"))
}

export function insertFreeForm(id, para) {
    document.write(bldStr("BCV1.FreeForm", id, para, (arguments.length > 2) ? arguments[2] : "100%"))
}

export function insertChart(id, para) {
    document.write(bldStr("BCV1.Chart", id, para, (arguments.length > 2) ? arguments[2] : "100%"))
}

export function insertUpload(id, para) {
    document.write(bldStr("BCV1.Upload", id, para, (arguments.length > 2) ? arguments[2] : "100%"))
}

export function insertFormDesigner(id, para) {
    document.write(bldStr("BCV4.FormDesigner", id, para, (arguments.length > 2) ? arguments[2] : "100%"))
}

export function insertEchart(id, para) {
    document.write(bldStr("BCV1.Echart", id, para, (arguments.length > 2) ? arguments[2] : "100%"))
}

//����ĺ���(�ؼ��ᷴ����ã���;:�л�����)
export function focusIE(obj_or_id) {
    if ($B.type != "ie") {
        document.activeElement.blur();
        return;
    }
    try {
        if (typeof (obj_or_id) == 'object') {
            if (document.activeElement != obj_or_id) obj_or_id.focus();
        } else {
            if (document.activeElement.id == obj_or_id) return;
            var o = document.getElementById(obj_or_id);
            if (o != null) o.focus();
        }
    } catch (e) {
      throw e;
    }
}
