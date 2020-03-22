package matsk.picturebed.DAO;

import matsk.picturebed.Pojo.picture;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
@Mapper
public interface pictureDao {
    /**
     * 插入一张新图片
     * @param newPicture
     * @return
     */
    int insertPicture(picture newPicture);

    /**
     * 查找数据库中是否已经存在相同图片
     * 使用MD5验证
     * @param Md5
     * @return
     */
    List<picture> verifyPictureExistsByMd5(String Md5);

    /**
     * 按照生成的名字查找数据库中的图片
     * @param picname
     * @return
     */
    List<picture> getPictureByName(String picname);

    /**
     * 根据原名称搜索图片
     * @param searchname
     * @return
     */
    List<picture> searchPictureByName(String searchname);

    /**
     * 根据Md5值搜索图片
     * @param Md5
     * @return
     */
    List<picture> searchPictureByMd5(String Md5);

    /**
     * 根据时间范围搜索图片
     * @param start
     * @param end
     * @return
     */
    List<picture> searchPictureByTime(@Param("start") Timestamp start,@Param("end") Timestamp end);
}
