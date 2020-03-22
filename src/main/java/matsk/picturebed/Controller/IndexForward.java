package matsk.picturebed.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexForward {
    @RequestMapping("/")
    public String index() {
        return "forward:index.html";
    }
}
