import Resizer from "@/components/worker/Resizer";
import Workbench from "@/components/worker/Workbench";
import { defineComponent } from "vue";

const HomeView = defineComponent({
  setup() {

    return () => (
      <div style="position: relative; height: 100vh; width: 100vw;">
        <Workbench>
          <Resizer>1</Resizer>
          <Resizer>2</Resizer>
          <Resizer>3</Resizer>
          <Resizer>4</Resizer>
        </Workbench>
      </div>
    );
  },
});

export default HomeView;
