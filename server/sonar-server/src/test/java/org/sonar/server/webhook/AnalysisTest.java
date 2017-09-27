/*
 * SonarQube
 * Copyright (C) 2009-2017 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

package org.sonar.server.webhook;

import java.util.Date;
import java.util.Random;
import org.apache.commons.lang.RandomStringUtils;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class AnalysisTest {

  @Test
  public void test_equality() {
    String uuid = RandomStringUtils.randomAlphanumeric(35);
    Date date = new Date(new Random().nextLong());
    assertThat(new Analysis(uuid, date)).isEqualTo(new Analysis(uuid, date));
    assertThat(new Analysis(uuid, date).hashCode()).isEqualTo(new Analysis(uuid, date).hashCode());

    assertThat(new Analysis(uuid, date)).isNotEqualTo(null);

    assertThat(new Analysis(uuid, date)).isNotEqualTo(new Analysis(uuid + "1", date));
    assertThat(new Analysis(uuid, date).hashCode()).isNotEqualTo(new Analysis(uuid + "1", date).hashCode());

    assertThat(new Analysis(uuid, date)).isNotEqualTo(new Analysis(uuid, new Date(date.getTime() + 1_000)));
    assertThat(new Analysis(uuid, date).hashCode()).isNotEqualTo(new Analysis(uuid, new Date(date.getTime() + 1_000)).hashCode());

    assertThat(new Analysis(uuid, date).getUuid()).isEqualTo(uuid);
    assertThat(new Analysis(uuid, date).getDate()).isEqualTo(date);
  }
}
