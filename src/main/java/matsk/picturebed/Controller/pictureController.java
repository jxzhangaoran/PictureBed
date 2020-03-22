package matsk.picturebed.Controller;

import matsk.picturebed.Service.pictureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
public class pictureController {
    @Autowired
    private pictureService pictureService;

    @RequestMapping("/uploadImage")
    public String uploadImage(HttpServletRequest request) throws IOException {
        return pictureService.handleUploadRequest(request);
    }

    @RequestMapping("/findPicByName")
    public String findPicByName(HttpServletRequest request) throws Exception {
        return pictureService.getPictureByName(request);
    }

    @RequestMapping("/findPicByMd5")
    public String findPicByMd5(HttpServletRequest request) throws Exception {
        return pictureService.getPictureByMd5(request);
    }

    @RequestMapping("/findPicByTime")
    public String findPicByTime(HttpServletRequest request) throws Exception {
        return pictureService.getPictureByTime(request);
    }
}
