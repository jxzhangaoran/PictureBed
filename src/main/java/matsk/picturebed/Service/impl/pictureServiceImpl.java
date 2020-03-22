package matsk.picturebed.Service.impl;

import com.alibaba.druid.support.json.JSONUtils;
import matsk.picturebed.DAO.pictureDao;
import matsk.picturebed.Pojo.picture;
import matsk.picturebed.Service.pictureService;
import matsk.picturebed.Utils.JacksonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class pictureServiceImpl implements pictureService {
    @Autowired
    private pictureDao pictureDao;

    @Override
    @Transactional
    //加上synchronized关键字，防止出现并发上传时相同图片名的问题，确保线程安全
    public synchronized String handleUploadRequest(HttpServletRequest request) throws IOException {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        /** 页面控件的文件流* */
        MultipartFile pictureFile = null;
        Map map = multipartRequest.getFileMap();
        for (Object obj : map.keySet()) {
            pictureFile = (MultipartFile) map.get(obj);
        }

        assert pictureFile != null;
        Timestamp now = new Timestamp(System.currentTimeMillis());
        int rand = (int)(Math.random() * 10);

        picture newPicture = new picture(
                0,
                pictureFile.getOriginalFilename(),
                DigestUtils.md5DigestAsHex(pictureFile.getInputStream()),
                now,
                "",
                now.getTime() + "-" + rand,
                Objects.requireNonNull(pictureFile.getOriginalFilename())
                        .substring(pictureFile
                        .getOriginalFilename()
                        .indexOf("."))//获取后缀名
        );

        newPicture.setUrl(getProjectRootUrl(request)
                + "save/" + newPicture.getGeneratedname()
                + newPicture.getSuffix());

        //System.err.println(newPicture);
        HashMap<String,String> resultMap = new HashMap<>();
        //异常处理
        //不插入数据库中已有的图片，通过md5值验证
        List<picture> verify = pictureDao.verifyPictureExistsByMd5(newPicture.getMd5());
        if (verify.size() > 0) {
            resultMap.put("error","服务器已存在此图片，链接为 " +
                    "<a href='" + verify.get(0).getUrl() + "' target='_blank'>"
                    + verify.get(0).getUrl() + "</a>");
        } else {
            //数据库中不存在此图片，这时写入新图片，并把图片文件保存在${root}/save/${generatedname}${suffix}
            pictureDao.insertPicture(newPicture);
            writeImageFile(pictureFile, request,
                    newPicture.getGeneratedname() + newPicture.getSuffix());
            resultMap.put("initialPreview",
                        "<p class='UploadOK'>上传成功，图片链接为：" +
                        "<a href='" + newPicture.getUrl() + "' target='_blank'>"
                                + newPicture.getUrl() + "</a>"
                        + "</p>");
        }
        return JSONUtils.toJSONString(resultMap);
    }

    /**
     * 获取项目根目录的URL
     * @param request
     * @return
     */
    private String getProjectRootUrl(HttpServletRequest request) {
        String path = request.getContextPath();
        String basePath = request.getScheme()
                + "://"+request.getServerName()
                + ":"+request.getServerPort()
                + path + "/";
        return basePath;
    }

    /**
     * 把项目图片保存到${项目webapp}/img/webpages目录下
     * @param imageFile
     * @param request
     * @return
     */
    private void writeImageFile(MultipartFile imageFile,
                                HttpServletRequest request,
                                String savename) {
        String savePath = request.getSession().getServletContext().getRealPath("/")
                + "save" + File.separator;//解决windows和linux文件系统斜杠不兼容的问题
        //System.out.println(savePath);
        //需要判断目录是否存在
        File dir = new File(savePath);
        if(!dir.exists()) {
            dir.mkdir();
        }
        File saveFile = new File(savePath + savename);
        try {
            //写入
            imageFile.transferTo(saveFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getPictureByName(HttpServletRequest request) throws Exception {
        String searchname = request.getParameter("searchname");
        List<picture> searchres = pictureDao.searchPictureByName(searchname);
        //System.out.println(searchres);
        return JacksonUtils.obj2json(searchres);
    }

    @Override
    public String getPictureByMd5(HttpServletRequest request) throws Exception {
        String searchmd5 = request.getParameter("searchmd5");
        List<picture> searchres = pictureDao.searchPictureByMd5(searchmd5);
        return JacksonUtils.obj2json(searchres);
    }


    @Override
    public String getPictureByTime(HttpServletRequest request) throws Exception {
        Timestamp start = new Timestamp(Long.parseLong(request.getParameter("starttime")));
        Timestamp end = new Timestamp(Long.parseLong(request.getParameter("endtime")));
        List<picture> searchres = pictureDao.searchPictureByTime(start,end);
        return JacksonUtils.obj2json(searchres);
    }
}
