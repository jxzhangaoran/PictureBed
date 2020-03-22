package matsk.picturebed.Pojo;

import java.sql.Timestamp;

public class picture {
    private Integer id;
    private String originalname;
    private String md5;
    private Timestamp uploadtime;
    private String url;
    private String generatedname;
    private String suffix;

    public picture(Integer id, String originalname, String md5, Timestamp uploadtime, String url, String generatedname, String suffix) {
        this.id = id;
        this.originalname = originalname;
        this.md5 = md5;
        this.uploadtime = uploadtime;
        this.url = url;
        this.generatedname = generatedname;
        this.suffix = suffix;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOriginalname() {
        return originalname;
    }

    public void setOriginalname(String originalname) {
        this.originalname = originalname;
    }

    public String getMd5() {
        return md5;
    }

    public void setMd5(String md5) {
        this.md5 = md5;
    }

    public Timestamp getUploadtime() {
        return uploadtime;
    }

    public void setUploadtime(Timestamp uploadtime) {
        this.uploadtime = uploadtime;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getGeneratedname() {
        return generatedname;
    }

    public void setGeneratedname(String generatedname) {
        this.generatedname = generatedname;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    @Override
    public String toString() {
        return "picture{" +
                "id=" + id +
                ", originalname='" + originalname + '\'' +
                ", md5='" + md5 + '\'' +
                ", uploadtime=" + uploadtime +
                ", url='" + url + '\'' +
                ", generatedname='" + generatedname + '\'' +
                ", suffix='" + suffix + '\'' +
                '}';
    }
}
