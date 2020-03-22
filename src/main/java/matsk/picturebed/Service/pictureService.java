package matsk.picturebed.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public interface pictureService {
    String handleUploadRequest(HttpServletRequest request) throws IOException;

    String getPictureByName(HttpServletRequest request) throws Exception;

    String getPictureByMd5(HttpServletRequest request) throws Exception;

    String getPictureByTime(HttpServletRequest request) throws Exception;
}
