import "vditor/dist/index.css";
import React from "react";
import Vditor from "vditor";

const App = () => {
  const [vd, setVd] = React.useState<Vditor>();
  React.useEffect(() => {
    const vditor = new Vditor("vditor", {
      after: () => {
        vditor.setValue("`Vditor` 最小代码示例");
        setVd(vditor);
      },
      input: value => {
        console.log(value);
      },
      blur: value => {
        // 预计触发时，存储一次草稿
        console.log('blur: %s', value);
      },
      ctrlEnter: value => {
        // 预计触发时，存储一次草稿
        console.log('enter: %s', value);
      },
      height: 360,
      cache: {
        id: 'vditor',
        enable:false,
      }
    });
  }, []);
  vd?.setValue("vdsvsd");
  return <div id="vditor" className="vditor" />;
};

export default App;
