// 查询数据
      printPdf() {
        let  LODOP = getLodop();
        LODOP.PRINT_INIT("订货单");
        LODOP.SET_PRINT_STYLE("FontSize", 18);
        LODOP.SET_PRINT_STYLE("Bold", 1);
        LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "打印页面部分内容");
        LODOP.ADD_PRINT_HTM(88, 200, 350, 600,
          document.getElementById("form1").innerHTML);
//        LODOP.PRINT();
        LODOP.PREVIEW();
      }